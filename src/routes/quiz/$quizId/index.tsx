import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ClockIcon,
  PlayIcon,
  TrophyIcon,
} from 'lucide-react'

import { getQuizAction } from '#/components/quiz/quiz-list'
import { getCurrentUserFn } from '#/data/auth'
import { getEngagementFn, getEngParticipationFn } from '#/data/quiz'
import { absoluteUrl, resolveOgImage } from '#/lib/seo'
import type { Engagement } from '#/lib/types'
import { cn, resolveMediaUrl } from '#/lib/utils'

export const Route = createFileRoute('/quiz/$quizId/')({
  loader: async ({ params }) => {
    const engagement = await getEngagementFn({
      data: { quizId: params.quizId },
    })
    const user = await getCurrentUserFn()
    let hasPlayed = false

    if (user) {
      try {
        const participation = await getEngParticipationFn({
          data: { quizId: params.quizId },
        })
        hasPlayed = participation.has_played
      } catch {
        hasPlayed = false
      }
    }

    const questionCount = engagement.questions?.length ?? 0
    const quiz = { ...engagement }
    delete quiz.questions

    return { quiz, questionCount, hasPlayed }
  },
  head: ({ loaderData, params }) => {
    const quiz = loaderData?.quiz
    const title = quiz?.title?.trim()
    const pageTitle = title ? `${title} | Quiz | Tisini` : 'Quiz | Tisini'
    const description =
      quiz?.description?.trim() ||
      (title
        ? `Play "${title}" on Tisini — test your sports knowledge.`
        : 'Play a quiz and test your knowledge on the latest sports news and events.')
    const canonical = absoluteUrl(`/quiz/${params.quizId}`)
    const image = resolveOgImage(quiz?.image_url)
    const ogTitle = title || 'Quiz | Tisini'

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: description },

        { property: 'og:site_name', content: 'Tisini' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: ogTitle },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: image },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: ogTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      links: [{ rel: 'canonical', href: canonical }],
    }
  },
  component: RouteComponent,
})

function parseQuizDate(value: string): Date {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
}

function formatQuizDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parseQuizDate(value))
}

function RouteComponent() {
  const { quiz, questionCount, hasPlayed } = Route.useLoaderData()
  const [now, setNow] = useState(() => new Date())
  const action = getQuizAction(quiz, now)
  const image = resolveMediaUrl(quiz.image_url)
  const startsAt = parseQuizDate(quiz.starts_at)

  useEffect(() => {
    if (action !== 'upcoming') return
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [action])

  const msRemaining = startsAt.getTime() - now.getTime()
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000))
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)

  return (
    <div className="py-6">
      <Link
        to="/quiz"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden />
        All quizzes
      </Link>

      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-muted/40 sm:aspect-[21/9]">
          {image ? (
            <img
              src={image}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklch,var(--secondary)_18%,transparent),transparent_50%)]"
              aria-hidden
            />
          )}
        </div>

        <div className="flex flex-col gap-5 p-5 sm:p-6">
          <div>
            <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              Quiz
            </p>
            <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {quiz.title}
            </h1>
            {quiz.description?.trim() ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {quiz.description}
              </p>
            ) : null}
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2 text-muted-foreground">
              <CalendarDaysIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
              <div>
                <dt className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase">
                  Open
                </dt>
                <dd className="text-foreground">
                  {formatQuizDate(quiz.starts_at)} –{' '}
                  {formatQuizDate(quiz.ends_at)}
                </dd>
              </div>
            </div>
            {questionCount > 0 ? (
              <div>
                <dt className="text-[0.65rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  Questions
                </dt>
                <dd className="text-foreground">
                  {questionCount}{' '}
                  {questionCount === 1 ? 'question' : 'questions'}
                </dd>
              </div>
            ) : null}
            {quiz.prize_description?.trim() ? (
              <div className="sm:col-span-2">
                <dt className="text-[0.65rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  Prize
                </dt>
                <dd className="font-medium text-secondary">
                  {quiz.prize_description}
                </dd>
              </div>
            ) : null}
          </dl>

          <QuizAction
            quiz={quiz}
            action={hasPlayed ? 'leaderboard' : action}
            hasPlayed={hasPlayed}
            countdown={
              days > 0
                ? `${days}d ${hours}h`
                : `${hours}h ${minutes.toString().padStart(2, '0')}m`
            }
          />
        </div>
      </article>
    </div>
  )
}

function QuizAction({
  quiz,
  action,
  hasPlayed,
  countdown,
}: {
  quiz: Engagement
  action: ReturnType<typeof getQuizAction>
  hasPlayed: boolean
  countdown: string
}) {
  if (action === 'play') {
    return (
      <Link
        to="/quiz/$quizId/play"
        params={{ quizId: quiz.id.toString() }}
        className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-emerald-600 sm:w-fit"
      >
        <PlayIcon className="size-4" aria-hidden />
        Play
        <ChevronRightIcon className="size-4" aria-hidden />
      </Link>
    )
  }

  if (action === 'leaderboard') {
    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {hasPlayed ? (
          <p className="text-sm text-muted-foreground">
            You have already played this quiz.
          </p>
        ) : null}
        <Link
          to="/quiz/$quizId/leaderboard"
          params={{ quizId: quiz.id.toString() }}
          className={cn(
            'inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 px-4 text-sm font-bold tracking-wide uppercase transition-colors hover:bg-muted hover:text-foreground',
            hasPlayed ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          <TrophyIcon className="size-4" aria-hidden />
          Leaderboard
          <ChevronRightIcon className="size-4" aria-hidden />
        </Link>
      </div>
    )
  }

  return (
    <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-muted/20 px-4 text-sm font-semibold text-primary">
      <ClockIcon className="size-4" aria-hidden />
      Starts in {countdown}
    </div>
  )
}
