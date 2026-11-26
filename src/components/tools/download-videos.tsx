
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { VideoToolApi, VideoToolError } from '#/lib/video-tool-api'
import type { VideoJob, VideoSession } from '#/lib/types'

type DownloadFormat = 'MP4' | 'MP3'

type DownloadQuality =
  | 'best'
  | '1080p'
  | '720p'
  | '480p'
  | '360p'

type QueueStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'done'
  | 'failed'
  | 'cancelled'

type DownloadItem = {
  id: string
  url: string
  format: DownloadFormat
  quality: DownloadQuality
  status: QueueStatus
  apiJobId?: string
  progress: number
  position?: number
  downloadUrl?: string
  error?: string
}

type DownloadVideosProps = {
  session: VideoSession
  onJobCreated?: () => void | Promise<void>
}

function isYouTubeUrl(value: string) {
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()

    return (
      hostname === 'youtu.be' ||
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com')
    )
  } catch {
    return false
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof VideoToolError) {
    return error.hint
      ? `${error.message} ${error.hint}`
      : error.message
  }

  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.'
}

function getProgress(progress: number) {
  const percentage = progress <= 1 ? progress * 100 : progress

  return Math.min(100, Math.max(0, Math.round(percentage)))
}

function createId() {
  return crypto.randomUUID()
}

function getStatusLabel(status: QueueStatus) {
  switch (status) {
    case 'pending':
      return 'Waiting'
    case 'queued':
      return 'Starting'
    case 'processing':
      return 'Processing'
    case 'done':
      return 'Completed'
    case 'failed':
      return 'Failed'
    case 'cancelled':
      return 'Cancelled'
  }
}

function getStatusClass(status: QueueStatus) {
  switch (status) {
    case 'done':
      return 'bg-green-500/10 text-green-600'
    case 'failed':
      return 'bg-destructive/10 text-destructive'
    case 'cancelled':
      return 'bg-muted text-muted-foreground'
    case 'pending':
      return 'bg-muted text-muted-foreground'
    default:
      return 'bg-primary/10 text-primary'
  }
}

export function DownloadVideos({
  session,
  onJobCreated,
}: DownloadVideosProps) {
  const api = useMemo(() => new VideoToolApi(session), [session])

  const [url, setUrl] = useState('')
  const [format, setFormat] = useState<DownloadFormat>('MP4')
  const [quality, setQuality] = useState<DownloadQuality>('best')

  const [items, setItems] = useState<DownloadItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const [isCancelling, setIsCancelling] = useState(false)
  const [formError, setFormError] = useState('')

  const startingRef = useRef(false)

  const activeItem = items.find((item) => item.id === activeId)

  // Submit only one pending item to the API at a time.
  useEffect(() => {
    if (activeId || startingRef.current) return

    const nextItem = items.find((item) => item.status === 'pending')

    if (!nextItem) return

    startingRef.current = true
    setActiveId(nextItem.id)

    setItems((current) =>
      current.map((item) =>
        item.id === nextItem.id
          ? { ...item, status: 'queued', error: undefined }
          : item,
      ),
    )

    async function submitNext(item: DownloadItem) {
      try {
        const options = {
          url: item.url,
          format: item.format,
          ...(item.format === 'MP4' && item.quality !== 'best'
            ? { quality: item.quality }
            : {}),
        }

        const createdJob = await api.createBasicDownload(options)

        setItems((current) =>
          current.map((currentItem) =>
            currentItem.id === item.id
              ? {
                  ...currentItem,
                  apiJobId: createdJob.id,
                  status: 'queued',
                  progress: 0,
                }
              : currentItem,
          ),
        )

        void onJobCreated?.()
      } catch (error) {
        setItems((current) =>
          current.map((currentItem) =>
            currentItem.id === item.id
              ? {
                  ...currentItem,
                  status: 'failed',
                  error: getErrorMessage(error),
                }
              : currentItem,
          ),
        )

        setActiveId(null)
      } finally {
        startingRef.current = false
      }
    }

    void submitNext(nextItem)
  }, [activeId, api, items, onJobCreated])

  // Poll the currently active API job.
  useEffect(() => {
    if (!activeItem?.apiJobId) return

    const jobId = activeItem.apiJobId
    const itemId = activeItem.id

    let active = true
    let timeout: ReturnType<typeof setTimeout>

    const isActive = () => active

    async function pollJob() {
      if (!isActive()) return

      try {
        const latestJob: VideoJob = await api.getJob(jobId)

        if (!isActive()) return

        setItems((current) =>
          current.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status:
                    latestJob.status === 'done' ||
                    latestJob.status === 'failed' ||
                    latestJob.status === 'cancelled'
                      ? latestJob.status
                      : latestJob.status === 'processing'
                        ? 'processing'
                        : 'queued',
                  progress: getProgress(latestJob.progress),
                  position: latestJob.position,
                  error: latestJob.error
                    ? [
                        latestJob.error.message,
                        latestJob.error.hint,
                      ]
                        .filter(Boolean)
                        .join(' ')
                    : undefined,
                }
              : item,
          ),
        )

        if (latestJob.status === 'done') {
          let link = ''
          let linkError = ''

          try {
            link = await api.getDownloadUrl(jobId)
          } catch (error) {
            linkError = `The download is ready, but its link could not be retrieved. ${getErrorMessage(error)}`
          }

          if (!isActive()) return

          setItems((current) =>
            current.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    status: 'done',
                    progress: 100,
                    downloadUrl: link,
                    error: linkError || undefined,
                  }
                : item,
            ),
          )

          setActiveId(null)
          return
        }

        if (
          latestJob.status === 'failed' ||
          latestJob.status === 'cancelled'
        ) {
          setActiveId(null)
          return
        }
      } catch (error) {
        if (isActive()) {
          setItems((current) =>
            current.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    error: getErrorMessage(error),
                  }
                : item,
            ),
          )
        }
      }

      if (isActive()) {
        timeout = setTimeout(pollJob, 2000)
      }
    }

    void pollJob()

    return () => {
      active = false
      clearTimeout(timeout)
    }
  }, [activeItem?.apiJobId, activeItem?.id, api])

  function addToQueue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedUrl = url.trim()

    if (!isYouTubeUrl(trimmedUrl)) {
      setFormError('Enter a valid YouTube video URL.')
      return
    }

    const newItem: DownloadItem = {
      id: createId(),
      url: trimmedUrl,
      format,
      quality,
      status: 'pending',
      progress: 0,
    }

    setItems((current) => [...current, newItem])
    setUrl('')
    setFormError('')
  }

  async function cancelActiveDownload() {
    if (!activeItem?.apiJobId) return

    setIsCancelling(true)

    try {
      const result = await api.cancelJob(activeItem.apiJobId)

      setItems((current) =>
        current.map((item) =>
          item.id === activeItem.id
            ? {
                ...item,
                status:
                  result.status === 'cancelled'
                    ? 'cancelled'
                    : result.status === 'failed'
                      ? 'failed'
                      : result.status === 'done'
                        ? 'done'
                        : result.status === 'processing'
                          ? 'processing'
                          : 'queued',
                progress: getProgress(result.progress),
                error: result.error?.message,
              }
            : item,
        ),
      )

      if (
        result.status === 'cancelled' ||
        result.status === 'failed' ||
        result.status === 'done'
      ) {
        setActiveId(null)
      }
    } catch (error) {
      setItems((current) =>
        current.map((item) =>
          item.id === activeItem.id
            ? {
                ...item,
                error: getErrorMessage(error),
              }
            : item,
        ),
      )
    } finally {
      setIsCancelling(false)
    }
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const pendingCount = items.filter(
    (item) => item.status === 'pending',
  ).length

  const completedCount = items.filter(
    (item) => item.status === 'done',
  ).length

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Download Videos</h2>

        <p className="text-sm text-muted-foreground">
          Download YouTube videos as MP4 or extract audio as MP3.
        </p>
      </div>

      <form onSubmit={addToQueue} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="youtube-url"
            className="text-sm font-medium"
          >
            YouTube URL
          </label>

          <input
            id="youtube-url"
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Download format
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('MP4')}
              aria-pressed={format === 'MP4'}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                format === 'MP4'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              MP4 Video
            </button>

            <button
              type="button"
              onClick={() => setFormat('MP3')}
              aria-pressed={format === 'MP3'}
              className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                format === 'MP3'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              MP3 Audio
            </button>
          </div>
        </div>

        {format === 'MP4' && (
          <div className="space-y-2">
            <label
              htmlFor="download-quality"
              className="text-sm font-medium"
            >
              Video quality
            </label>

            <select
              id="download-quality"
              value={quality}
              onChange={(event) =>
                setQuality(event.target.value as DownloadQuality)
              }
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="best">Best available</option>
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
              <option value="360p">360p</option>
            </select>
          </div>
        )}

        {formError && (
          <p className="text-sm text-destructive">{formError}</p>
        )}

        <button
          type="submit"
          disabled={!url.trim()}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add to queue
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Download queue</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              One download runs at a time.
            </p>
          </div>

          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>{pendingCount} waiting</span>
            <span>{completedCount} completed</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="text-sm font-medium">Your queue is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a YouTube URL above to begin.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const isActive = item.id === activeId
              const progress = getProgress(item.progress)

              return (
                <div
                  key={item.id}
                  className="space-y-4 rounded-xl border bg-card p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="break-all text-sm font-medium">
                        {item.url}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {item.format}
                        {item.format === 'MP4' &&
                          ` · ${item.quality === 'best' ? 'Best available' : item.quality}`}
                        {isActive && item.apiJobId
                          ? ` · Job ${item.apiJobId}`
                          : ''}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(item.status)}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </div>

                  {isActive && (
                    <div className="space-y-3">
                      {item.status === 'queued' && (
                        <p className="text-sm text-muted-foreground">
                          Submitting your download...
                        </p>
                      )}

                      {item.status === 'processing' && (
                        <p className="text-sm text-muted-foreground">
                          Downloading and processing your video...
                        </p>
                      )}

                      {item.status === 'queued' ||
                      item.status === 'processing' ? (
                        <>
                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                        </>
                      ) : null}

                      <button
                        type="button"
                        onClick={cancelActiveDownload}
                        disabled={isCancelling || !item.apiJobId}
                        className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
                      >
                        {isCancelling
                          ? 'Cancelling...'
                          : 'Cancel download'}
                      </button>
                    </div>
                  )}

                  {item.status === 'pending' && (
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-muted-foreground">
                        Waiting for the active download to finish.
                      </p>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {item.status === 'done' && (
                    <div className="space-y-3">
                      <p className="text-sm text-green-600">
                        Your download is ready.
                      </p>

                      {item.downloadUrl ? (
                        <a
                          href={item.downloadUrl}
                          download
                          className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          Download {item.format}
                        </a>
                      ) : (
                        <p className="text-sm text-destructive">
                          {item.error ||
                            'The download link is unavailable.'}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {(item.status === 'failed' ||
                    item.status === 'cancelled') && (
                    <div className="space-y-3">
                      <p
                        className={`text-sm ${
                          item.status === 'failed'
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.error ||
                          (item.status === 'failed'
                            ? 'The download failed.'
                            : 'The download was cancelled.')}
                      </p>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
