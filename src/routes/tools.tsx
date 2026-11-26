
import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { getCurrentUserFn } from '#/data/auth.ts'
import { getVideoSessionFn } from '#/data/video-tool.ts'
import type { VideoSession } from '#/lib/types.ts'

import { ToolsContent } from '#/components/tools/tools-content.tsx'

export const Route = createFileRoute('/tools')({
  component: ToolsPage,
})

function ToolsLandingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-card px-6 py-12 sm:px-10 sm:py-16">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Video tools
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Prepare your match footage with ease.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Download videos from YouTube, extract audio, and combine
            video files into a single clip. Everything you need for
            a smoother video workflow.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/login"
              search={{ redirect: '/tools' }}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
            </Link>

            <a
              href="#available-tools"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore the tools
            </a>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Sign in to access the tools and your usage limits.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        />
      </section>

      {/* Available tools */}
      <section id="available-tools" className="mt-16 scroll-mt-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">
            Available tools
          </h2>

          <p className="mt-2 text-muted-foreground">
            Choose what you need to do with your video footage.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {/* Merge videos */}
          <article className="flex flex-col rounded-xl border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
              01
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Merge videos
            </h3>

            <p className="mt-2 flex-1 leading-7 text-muted-foreground">
              Combine multiple video files from your computer into
              one video. Arrange your footage in the order you want
              before merging.
            </p>

            <div className="mt-6 border-t pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Supports
              </p>
              <p className="mt-2 text-sm">
                Local video files
              </p>
            </div>
          </article>

          {/* Download videos */}
          <article className="flex flex-col rounded-xl border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
              02
            </div>

            <h3 className="mt-5 text-xl font-semibold">
              Download videos
            </h3>

            <p className="mt-2 flex-1 leading-7 text-muted-foreground">
              Download videos using a YouTube link. Choose video
              format and quality, or extract the audio when you
              only need the sound.
            </p>

            <div className="mt-6 border-t pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Supports
              </p>
              <p className="mt-2 text-sm">
                MP4 video and MP3 audio
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">
            How it works
          </h2>

          <p className="mt-2 text-muted-foreground">
            A straightforward process from start to finish.
          </p>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm font-bold text-primary">STEP 01</p>
            <h3 className="mt-3 font-semibold">Choose a tool</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Select video merging or downloading, depending on
              what you need.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-primary">STEP 02</p>
            <h3 className="mt-3 font-semibold">Add your footage</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Upload video files from your computer or provide a
              YouTube link.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-primary">STEP 03</p>
            <h3 className="mt-3 font-semibold">Process and download</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Let the tool process your request, then download
              the finished result.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-16 rounded-2xl border bg-muted/40 px-6 py-10 text-center sm:px-10">
        <h2 className="text-2xl font-bold tracking-tight">
          Ready to work with your footage?
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          Sign in to access the video tools and start processing
          your footage.
        </p>

        <Link
          to="/login"
          search={{ redirect: '/tools' }}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sign in to continue
        </Link>
      </section>
    </main>
  )
}

function ToolsPage() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [session, setSession] = useState<VideoSession | null>(null)
  const [loadingSession, setLoadingSession] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    getCurrentUserFn()
      .then((user) => {
        if (alive) setSignedIn(Boolean(user))
      })
      .catch(() => {
        if (alive) setSignedIn(false)
      })

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!signedIn) return

    let alive = true

    async function loadSession() {
      setLoadingSession(true)
      setSessionError(null)

      try {
        const result = await getVideoSessionFn()

        if (!alive) return

        if (!result) {
          setSessionError('Could not connect to the video service.')
          return
        }

        setSession(result as VideoSession)
      } catch {
        if (alive) {
          setSessionError('Could not connect to the video service.')
        }
      } finally {
        if (alive) setLoadingSession(false)
      }
    }

    loadSession()

    return () => {
      alive = false
    }
  }, [signedIn])

  if (signedIn === null) {
    return <main className="min-h-[50vh]" />
  }

  if (!signedIn) {
    return <ToolsLandingPage />
  }

  if (loadingSession) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <p className="text-muted-foreground">
          Connecting to video tools...
        </p>
      </main>
    )
  }

  if (sessionError || !session) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-xl font-semibold">
          Video tools unavailable
        </h1>

        <p className="mt-2 text-muted-foreground">
          {sessionError || 'Could not establish a video session.'}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Try again
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <ToolsContent session={session} />
    </main>
  )
}
