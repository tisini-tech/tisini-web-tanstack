import { useEffect, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  ImageIcon,
  PlayIcon,
  TrophyIcon,
} from 'lucide-react'

import type { Engagement } from '#/lib/types'
import { getEngagementAction } from './action'
import { cn, resolveMediaUrl } from '#/lib/utils'

type EngagementAction = ReturnType<typeof getEngagementAction>
export type EngagementSection = 'quiz' | 'tanobora'

type EngagementTarget = 'detail' | 'play' | 'leaderboard'

function parseQuizDate(value: string): Date {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
}

function formatQuizDateRange(quiz: Engagement): string {
  const format = (date: Date) =>
    new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)

  return `${format(parseQuizDate(quiz.starts_at))} – ${format(parseQuizDate(quiz.ends_at))}`
}

function actionLabel(action: EngagementAction): string {
  if (action === 'play') return 'Open'
  if (action === 'leaderboard') return 'Ended'
  return 'Upcoming'
}

function actionBadgeClass(action: EngagementAction): string {
  if (action === 'play') {
    return 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/40'
  }
  if (action === 'leaderboard') {
    return 'bg-muted text-muted-foreground ring-border'
  }
  return 'bg-primary/15 text-primary ring-primary/30'
}

export default function EngagementCard({
  engagement,
  type,
}: {
  engagement: Engagement
  type: EngagementSection
}) {
  const action = getEngagementAction(engagement)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative">
        <EngagementImage
          src={engagement.image_url}
          alt=""
          className="border-b border-border"
        />
        <span
          className={cn(
            'absolute top-3 left-3 rounded-md px-2 py-1 text-[0.6rem] font-bold tracking-wider uppercase ring-1',
            actionBadgeClass(action),
            action === 'play' && 'animate-pulse',
          )}
        >
          {actionLabel(action)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-heading text-lg font-bold tracking-tight text-foreground">
            <EngagementLink
              type={type}
              id={engagement.id.toString()}
              target="detail"
              className="hover:text-emerald-300"
            >
              {engagement.title}
            </EngagementLink>
          </h3>
          {engagement.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {engagement.description}
            </p>
          ) : null}
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDaysIcon className="size-3.5 shrink-0" aria-hidden />
            {formatQuizDateRange(engagement)}
          </p>
        </div>
        <QuizActionLink
          quiz={engagement}
          action={action}
          type={type}
          prominent
        />
      </div>
    </article>
  )
}

function EngagementImage({
  src,
  alt,
  className,
  rounded = false,
  variant = 'row',
}: {
  src: string | null
  alt: string
  className?: string
  rounded?: boolean
  variant?: 'featured' | 'row'
}) {
  const resolved = resolveMediaUrl(src)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [resolved])

  return (
    <div
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden bg-[#120818]',
        rounded && 'rounded-xl',
        variant === 'featured' ? 'aspect-[16/9]' : 'aspect-square',
        className,
      )}
    >
      {resolved && !failed ? (
        <img
          src={resolved}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklch,var(--secondary)_18%,transparent),transparent_50%)]"
            aria-hidden
          />
          <div className="relative flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon
              className={
                variant === 'featured'
                  ? 'size-8 opacity-60'
                  : 'size-5 opacity-60'
              }
              aria-hidden
            />
            <span className="text-[0.65rem] font-bold tracking-[0.14em] uppercase">
              Image
            </span>
          </div>
        </>
      )}
    </div>
  )
}

function QuizActionLink({
  quiz,
  action,
  type,
  prominent = false,
}: {
  quiz: Engagement
  action: EngagementAction
  type: EngagementSection
  prominent?: boolean
}) {
  const className = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-wide uppercase transition-colors',
    prominent
      ? 'h-11 w-full px-6 text-sm'
      : 'h-11 w-full shrink-0 px-5 text-sm sm:w-auto',
    action === 'play'
      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
      : 'border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
  )
  const target: EngagementTarget =
    action === 'play'
      ? 'play'
      : action === 'leaderboard'
        ? 'leaderboard'
        : 'detail'

  return (
    <EngagementLink
      type={type}
      id={quiz.id.toString()}
      target={target}
      className={className}
    >
      {action === 'play' ? (
        <PlayIcon className="size-4" aria-hidden />
      ) : action === 'leaderboard' ? (
        <TrophyIcon className="size-4" aria-hidden />
      ) : null}
      {action === 'play'
        ? 'Play'
        : action === 'leaderboard'
          ? 'Leaderboard'
          : 'View'}
      {action === 'leaderboard' ? null : (
        <ChevronRightIcon className="size-4" aria-hidden />
      )}
    </EngagementLink>
  )
}

function EngagementLink({
  type,
  id,
  target,
  className,
  children,
}: {
  type: EngagementSection
  id: string
  target: EngagementTarget
  className?: string
  children: ReactNode
}) {
  if (target === 'play') {
    return (
      <Link
        to="/engagements/$engType/$engagementId/play"
        params={{ engType: type, engagementId: id }}
        className={className}
      >
        {children}
      </Link>
    )
  }
  if (target === 'leaderboard') {
    return (
      <Link
        to="/engagements/$engType/$engagementId/leaderboard"
        params={{ engType: type, engagementId: id }}
        className={className}
      >
        {children}
      </Link>
    )
  }
  return (
    <Link
      to="/engagements/$engType/$engagementId"
      params={{ engType: type, engagementId: id }}
      className={className}
    >
      {children}
    </Link>
  )
}
