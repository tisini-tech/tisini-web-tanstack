
import { useEffect, useMemo, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import type { VideoJob, VideoSession } from '#/lib/types'
import { VideoToolApi, VideoToolError } from '#/lib/video-tool-api'

type VideoSource = {
  id: string
  name: string
  file: File
  size: number
  duration?: number
}

type MergeVideosProps = {
  session: VideoSession
  maxSources?: number
  maxFileSizeMb?: number
  onJobCreated?: () => void | Promise<void>
}

type MergeStage =
  | 'idle'
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'done'
  | 'failed'
  | 'cancelled'

const ACCEPTED_EXTENSIONS = [
  '.mp4',
  '.m4v',
  '.mov',
  '.mkv',
  '.webm',
  '.avi',
  '.flv',
  '.ts',
  '.mts',
  '.m2ts',
]

const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(',')

function createId() {
  return crypto.randomUUID()
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(seconds?: number) {
  if (seconds === undefined || !Number.isFinite(seconds)) {
    return 'Reading duration...'
  }

  const totalSeconds = Math.floor(seconds)
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = totalSeconds % 60

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    return `${hours}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`
}

function isSupportedVideo(file: File) {
  const extension = file.name
    .slice(file.name.lastIndexOf('.'))
    .toLowerCase()

  return (
    file.type.startsWith('video/') ||
    ACCEPTED_EXTENSIONS.includes(extension)
  )
}

function readVideoDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const video = document.createElement('video')

    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      const duration = video.duration
      URL.revokeObjectURL(objectUrl)

      resolve(Number.isFinite(duration) ? duration : undefined)
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(undefined)
    }

    video.src = objectUrl
  })
}

function getErrorMessage(error: unknown) {
  if (error instanceof VideoToolError) {
    return error.hint
      ? `${error.message} ${error.hint}`
      : error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while processing your videos.'
}

export function MergeVideos({
  session,
  maxSources = 6,
  maxFileSizeMb = 5120,
  onJobCreated,
}: MergeVideosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const api = useMemo(() => new VideoToolApi(session), [session])

  const [sources, setSources] = useState<VideoSource[]>([])
  const [fileError, setFileError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const [stage, setStage] = useState<MergeStage>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [job, setJob] = useState<VideoJob | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [workflowError, setWorkflowError] = useState('')
  const [isCancelling, setIsCancelling] = useState(false)

  const maxFileSize = maxFileSizeMb * 1024 * 1024

  const isBusy =
    stage === 'uploading' ||
    stage === 'queued' ||
    stage === 'processing'

  const totalDuration = sources.every(
    (source) => source.duration !== undefined,
  )
    ? sources.reduce(
        (total, source) => total + (source.duration ?? 0),
        0,
      )
    : undefined

  const jobProgress = Math.max(
    0,
    Math.min(
      100,
      (job?.progress ?? 0) <= 1
        ? (job?.progress ?? 0) * 100
        : (job?.progress ?? 0),
    ),
  )

  function addFiles(fileList: FileList | File[]) {
    setFileError('')

    const selectedFiles = Array.from(fileList)

    if (selectedFiles.length === 0) return

    const remainingSlots = maxSources - sources.length

    if (remainingSlots <= 0) {
      setFileError(`You can add a maximum of ${maxSources} videos.`)
      return
    }

    const acceptedSources: VideoSource[] = []
    const errors: string[] = []

    for (const file of selectedFiles) {
      if (acceptedSources.length >= remainingSlots) {
        errors.push(`Only ${maxSources} videos can be added.`)
        break
      }

      if (file.size === 0) {
        errors.push(`${file.name} is empty.`)
        continue
      }

      if (file.size > maxFileSize) {
        errors.push(
          `${file.name} exceeds the ${maxFileSizeMb} MB file size limit.`,
        )
        continue
      }

      if (!isSupportedVideo(file)) {
        errors.push(`${file.name} is not a supported video format.`)
        continue
      }

      acceptedSources.push({
        id: createId(),
        name: file.name,
        file,
        size: file.size,
      })
    }

    if (acceptedSources.length > 0) {
      setSources((current) => [...current, ...acceptedSources])

      for (const source of acceptedSources) {
        readVideoDuration(source.file).then((duration) => {
          if (duration === undefined) return

          setSources((current) =>
            current.map((item) =>
              item.id === source.id
                ? { ...item, duration }
                : item,
            ),
          )
        })
      }
    }

    if (errors.length > 0) {
      setFileError(errors.join(' '))
    }
  }

  function removeSource(id: string) {
    setSources((current) =>
      current.filter((source) => source.id !== id),
    )
  }

  function moveSource(index: number, direction: -1 | 1) {
    const newIndex = index + direction

    if (newIndex < 0 || newIndex >= sources.length) return

    setSources((current) => {
      const updated = [...current]

      ;[updated[index], updated[newIndex]] = [
        updated[newIndex],
        updated[index],
      ]

      return updated
    })
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(false)

    if (!isBusy && event.dataTransfer.files.length > 0) {
      addFiles(event.dataTransfer.files)
    }
  }

  async function startMerge() {
    if (sources.length < 2 || isBusy) return

    setWorkflowError('')
    setDownloadUrl('')
    setJob(null)
    setJobId(null)
    setUploadProgress(0)
    setStage('uploading')

    try {
      const totalBytes = sources.reduce(
        (total, source) => total + source.size,
        0,
      )

      let uploadedBytes = 0

      const uploadedIds = new Map<string, string>()

      // Upload files sequentially and track combined upload progress.
      for (const source of sources) {
        const uploaded = await api.uploadFile(
          source.file,
          (progress) => {
            const currentBytes =
              uploadedBytes + source.size * progress

            setUploadProgress(
              totalBytes > 0
                ? Math.round((currentBytes / totalBytes) * 100)
                : 100,
            )
          },
        )

        uploadedIds.set(source.id, uploaded.id)
        uploadedBytes += source.size

        setUploadProgress(
          totalBytes > 0
            ? Math.round((uploadedBytes / totalBytes) * 100)
            : 100,
        )
      }

      // Preserve the selected playing order when creating API sources.
      const mergeSources = sources.map((source) => {
        const uploadId = uploadedIds.get(source.id)

        if (!uploadId) {
          throw new Error(
            `Could not find the uploaded file: ${source.name}`,
          )
        }

        return { upload: uploadId }
      })

      const createdJob = await api.createMergeJob(mergeSources)

      setJobId(createdJob.id)
      setStage('queued')

      void onJobCreated?.()
    } catch (error) {
      setWorkflowError(getErrorMessage(error))
      setStage('failed')
    }
  }

  async function cancelMerge() {
    if (!jobId || isCancelling) return

    setIsCancelling(true)
    setWorkflowError('')

    try {
      const result = await api.cancelJob(jobId)
      setJob(result)
      setStage('cancelled')
    } catch (error) {
      setWorkflowError(getErrorMessage(error))
    } finally {
      setIsCancelling(false)
    }
  }

  function resetWorkflow() {
    setStage('idle')
    setUploadProgress(0)
    setJob(null)
    setJobId(null)
    setDownloadUrl('')
    setWorkflowError('')
    setIsCancelling(false)
  }

  // Poll the API while the merge job is queued or processing.
  useEffect(() => {
    if (
      !jobId ||
      (stage !== 'queued' && stage !== 'processing')
    ) {
      return
    }

    const currentJobId = jobId

    let stopped = false
    let timeout: ReturnType<typeof setTimeout>

    const isStopped = () => stopped

    async function pollJob() {
      try {
        const currentJob = await api.getJob(currentJobId)

        if (isStopped()) return

        setJob(currentJob)

        if (currentJob.status === 'done') {
          const url = await api.getDownloadUrl(currentJobId)

          if (isStopped()) return

          setDownloadUrl(url)
          setStage('done')
          return
        }

        if (currentJob.status === 'failed') {
          setWorkflowError(
            currentJob.error?.message ||
              'The merge job failed. Please try again.',
          )
          setStage('failed')
          return
        }

        if (currentJob.status === 'cancelled') {
          setStage('cancelled')
          return
        }

        setStage(
          currentJob.status === 'queued'
            ? 'queued'
            : 'processing',
        )

        timeout = setTimeout(pollJob, 2000)
      } catch (error) {
        if (isStopped()) return

        setWorkflowError(getErrorMessage(error))
        setStage('failed')
      }
    }

    void pollJob()

    return () => {
      stopped = true
      clearTimeout(timeout)
    }
  }, [api, jobId, stage])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Merge Videos</h2>

        <p className="text-sm text-muted-foreground">
          Join multiple video files into one. Add videos from your
          computer, then arrange them in playing order.
        </p>
      </div>

      {/* Playing order strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Playing order</h3>

          <span className="text-xs text-muted-foreground">
            {sources.length} / {maxSources} videos
          </span>
        </div>

        {sources.length === 0 ? (
          <div className="flex h-12 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
            Your video sequence will appear here
          </div>
        ) : (
          <div className="flex h-12 gap-1 overflow-hidden rounded-lg">
            {sources.map((source, index) => {
              const width =
                totalDuration && totalDuration > 0
                  ? `${((source.duration ?? 0) / totalDuration) * 100}%`
                  : `${100 / sources.length}%`

              return (
                <div
                  key={source.id}
                  title={`${index + 1}. ${source.name}`}
                  className="flex min-w-0 items-center justify-center overflow-hidden rounded-sm bg-primary/15 px-2 text-xs font-medium text-primary"
                  style={{
                    width,
                    flexGrow: totalDuration ? 0 : 1,
                  }}
                >
                  {index + 1}
                </div>
              )
            })}
          </div>
        )}

        {totalDuration !== undefined && sources.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Total duration: {formatDuration(totalDuration)}
          </p>
        )}
      </div>

      {/* File selection and drag/drop */}
      <div
        onDragOver={(event) => {
          event.preventDefault()
          if (!isBusy) setIsDragging(true)
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsDragging(false)
          }
        }}
        onDrop={handleDrop}
        className={`space-y-3 rounded-xl border border-dashed p-6 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border'
        }`}
      >
        <div className="space-y-1">
          <p className="text-sm font-medium">Drop video files here</p>

          <p className="text-xs text-muted-foreground">
            Or select videos from your computer
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          disabled={isBusy}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) {
              addFiles(event.target.files)
            }

            event.target.value = ''
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy || sources.length >= maxSources}
          className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add videos
        </button>

        <p className="text-xs text-muted-foreground">
          Maximum {maxSources} videos · {maxFileSizeMb} MB per file
        </p>

        {fileError && (
          <p role="alert" className="text-sm text-destructive">
            {fileError}
          </p>
        )}
      </div>

      {/* Source list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Your videos</h3>

          {sources.length > 0 && (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => setSources([])}
              className="text-xs text-muted-foreground hover:text-destructive disabled:opacity-50"
            >
              Clear all
            </button>
          )}
        </div>

        {sources.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No videos added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sources.map((source, index) => (
              <div
                key={source.id}
                className="flex items-center gap-3 rounded-lg border bg-card p-3"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium">
                    {source.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {formatBytes(source.size)} · {formatDuration(source.duration)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Move ${source.name} up`}
                    title="Move up"
                    disabled={isBusy || index === 0}
                    onClick={() => moveSource(index, -1)}
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    aria-label={`Move ${source.name} down`}
                    title="Move down"
                    disabled={isBusy || index === sources.length - 1}
                    onClick={() => moveSource(index, 1)}
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-30"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    aria-label={`Remove ${source.name}`}
                    title="Remove video"
                    disabled={isBusy}
                    onClick={() => removeSource(source.id)}
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Add at least two videos to create a merged video. Their order
        here determines the order in the final video.
      </p>

      {/* Merge workflow */}
      <div className="space-y-4 rounded-xl border p-4">
        {stage === 'idle' && (
          <button
            type="button"
            onClick={startMerge}
            disabled={sources.length < 2}
            className="h-11 w-full rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Merge videos
          </button>
        )}

        {stage === 'uploading' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Uploading your videos</span>

              <span className="tabular-nums text-muted-foreground">
                {uploadProgress}%
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Local files are uploaded one at a time. Keep this page
              open until the upload finishes.
            </p>
          </div>
        )}

        {(stage === 'queued' || stage === 'processing') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  {stage === 'queued'
                    ? 'Waiting in the queue'
                    : 'Joining videos'}
                </p>

                <p className="text-xs text-muted-foreground">
                  {stage === 'queued' && job?.position
                    ? `Queue position: ${job.position}`
                    : stage === 'queued'
                      ? 'Your merge job is waiting to start.'
                      : 'Your merge is being processed.'}
                </p>
              </div>

              <span className="text-sm tabular-nums text-muted-foreground">
                {Math.round(jobProgress)}%
              </span>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={jobProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${jobProgress}%` }}
              />
            </div>

            <button
              type="button"
              onClick={cancelMerge}
              disabled={isCancelling}
              className="h-9 rounded-lg border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              {isCancelling ? 'Cancelling...' : 'Cancel merge'}
            </button>
          </div>
        )}

        {stage === 'done' && (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">
                Your video is ready
              </p>

              <p className="text-xs text-muted-foreground">
                The merged video has been created successfully.
              </p>
            </div>

            <a
              href={downloadUrl}
              className="flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Download merged video
            </a>

            <p className="text-xs text-muted-foreground">
              The download link is temporary. Save your video before
              it expires.
            </p>

            <button
              type="button"
              onClick={resetWorkflow}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Start another merge
            </button>
          </div>
        )}

        {(stage === 'failed' || stage === 'cancelled') && (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold">
                {stage === 'cancelled'
                  ? 'Merge cancelled'
                  : 'Merge unsuccessful'}
              </p>

              <p className="text-sm text-destructive">
                {workflowError ||
                  (stage === 'cancelled'
                    ? 'The merge job was cancelled.'
                    : 'The merge could not be completed.')}
              </p>
            </div>

            <button
              type="button"
              onClick={resetWorkflow}
              className="h-10 rounded-lg border px-4 text-sm font-medium hover:bg-muted"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
