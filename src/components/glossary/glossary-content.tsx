import { useEffect, useRef, useState } from 'react'

type GlossaryContentProps = {
  name: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
}

type YouTubeClip = {
  videoId: string
  start: number
  end: number
}

type YouTubePlayerEvent = {
  data: number
}

type YouTubePlayer = {
  destroy: () => void
  playVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
}

type YouTubePlayerOptions = {
  videoId: string
  playerVars: {
    autoplay: number
    controls: number
    disablekb: number
    fs: number
    modestbranding: number
    rel: number
    playsinline: number
    start: number
    end: number
    origin: string
  }
  events: {
    onStateChange: (event: YouTubePlayerEvent) => void
  }
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement,
        options: YouTubePlayerOptions,
      ) => YouTubePlayer
      PlayerState: {
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<void> | null = null

function loadYouTubeAPI(): Promise<void> {
  if (window.YT?.Player) {
    return Promise.resolve()
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise
  }

  youtubeApiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')

    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true

    window.onYouTubeIframeAPIReady = () => {
      resolve()
    }

    script.onerror = () => {
      youtubeApiPromise = null
      reject(new Error('Failed to load YouTube API'))
    }

    document.head.appendChild(script)
  })

  return youtubeApiPromise
}

function parseTimestamp(value: string | null): number {
  if (!value) return 0

  if (/^\d+$/.test(value)) {
    return Number(value)
  }

  const match = value.match(
    /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/,
  )

  if (!match || !match[0]) return 0

  return (
    Number(match[1] || 0) * 3600 +
    Number(match[2] || 0) * 60 +
    Number(match[3] || 0)
  )
}

function getYouTubeClip(videoUrl: string): YouTubeClip | null {
  try {
    const url = new URL(videoUrl)

    const host = url.hostname.replace(/^www\./, '')

    if (
      host !== 'youtube.com' &&
      host !== 'm.youtube.com' &&
      host !== 'youtube-nocookie.com'
    ) {
      return null
    }

    if (!url.pathname.startsWith('/embed/')) {
      return null
    }

    const videoId = url.pathname.split('/')[2]

    if (!videoId) return null

    const start = parseTimestamp(url.searchParams.get('start'))
    const end = parseTimestamp(url.searchParams.get('end'))

    if (end <= start) return null

    return { videoId, start, end }
  } catch {
    return null
  }
}

export function GlossaryContent({
  name,
  description,
  imageUrl,
  videoUrl,
}: GlossaryContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)

  const [ended, setEnded] = useState(false)
  const [playerError, setPlayerError] = useState(false)

  const clip = videoUrl ? getYouTubeClip(videoUrl) : null

  useEffect(() => {
    if (!clip || !containerRef.current) return

    let cancelled = false
    let player: YouTubePlayer | null = null

    async function initialisePlayer() {
      try {
        await loadYouTubeAPI()

        if (cancelled || !containerRef.current || !window.YT) {
          return
        }

        player = new window.YT.Player(containerRef.current, {
          videoId: clip!.videoId,

          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            start: clip!.start,
            end: clip!.end,
            origin: window.location.origin,
          },

          events: {
            onStateChange: (event) => {
              if (
                event.data === window.YT?.PlayerState.ENDED
              ) {
                setEnded(true)
              } else {
                setEnded(false)
              }
            },
          },
        })

        playerRef.current = player
      } catch {
        if (!cancelled) {
          setPlayerError(true)
        }
      }
    }

    void initialisePlayer()

    return () => {
      cancelled = true
      player?.destroy()
      playerRef.current = null
    }
  }, [clip?.videoId, clip?.start, clip?.end])

  function replayClip() {
    if (!playerRef.current || !clip) return

    setEnded(false)

    playerRef.current.seekTo(clip.start, true)
    playerRef.current.playVideo()
  }

  return (
    <article className="space-y-4">
      <h3 className="text-lg font-semibold">
        {name}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="w-full max-w-lg rounded-lg object-cover"
        />
      )}

      {clip && (
        <div className="relative aspect-video w-full max-w-2xl overflow-hidden rounded-lg bg-black">
          <div
            ref={containerRef}
            className="absolute inset-0 h-full w-full"
          />

          {ended && (
            <button
              type="button"
              onClick={replayClip}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/75 text-white"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl">
                ↻
              </span>

              <span className="text-sm font-semibold">
                Replay clip
              </span>
            </button>
          )}

          {playerError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-sm text-white">
              Unable to load this video.
            </div>
          )}
        </div>
      )}

      {videoUrl && !clip && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline"
        >
          Watch demonstration
        </a>
      )}
    </article>
  )
}
