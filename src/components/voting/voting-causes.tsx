import { Link } from '@tanstack/react-router'
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  ImageIcon,
} from 'lucide-react'

import type { VoteCause } from '#/lib/types'
import { cn } from '#/lib/utils'

type VoteStatus = 'upcoming' | 'open' | 'ended'

function parseVoteDate(value: string): Date {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
}

export function getVoteStatus(
  cause: Pick<VoteCause, 'date_from' | 'date_to'>,
  now = new Date(),
): VoteStatus {
  const from = parseVoteDate(cause.date_from)
  const to = parseVoteDate(cause.date_to)

  if (now < from) return 'upcoming'
  if (now > to) return 'ended'
  return 'open'
}

function formatVoteDateRange(cause: VoteCause): string {
  const from = parseVoteDate(cause.date_from)
  const to = parseVoteDate(cause.date_to)

  const format = (date: Date) =>
    new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)

  return `${format(from)} – ${format(to)}`
}

function statusLabel(status: VoteStatus): string {
  if (status === 'open') return 'Open'
  if (status === 'ended') return 'Ended'
  return 'Upcoming'
}

function statusClass(status: VoteStatus): string {
  if (status === 'open') {
    return 'bg-secondary/15 text-secondary ring-secondary/30'
  }
  if (status === 'ended') {
    return 'bg-muted text-muted-foreground ring-border'
  }
  return 'bg-primary/15 text-primary ring-primary/30'
}

export function VotingCauses({ causes }: { causes: VoteCause[] }) {
  const sorted = [...causes].sort((a, b) => {
    const statusOrder = { open: 0, upcoming: 1, ended: 2 }
    const statusDiff =
      statusOrder[getVoteStatus(a)] - statusOrder[getVoteStatus(b)]
    if (statusDiff !== 0) return statusDiff
    return (
      parseVoteDate(b.date_from).getTime() -
      parseVoteDate(a.date_from).getTime()
    )
  })

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
        <p className="text-sm font-semibold text-foreground">No votes yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Fan votes will appear here when a poll is published.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((cause) => (
        <li key={cause.id}>
          <VoteCauseCard cause={cause} />
        </li>
      ))}
    </ul>
  )
}

function VoteCauseCard({ cause }: { cause: VoteCause }) {
  const status = getVoteStatus(cause)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-border bg-[#120818]">
        {cause.image_url ? (
          <img
            src={cause.image_url}
            alt=""
            className="size-full object-contain"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_55%),radial-gradient(circle_at_80%_80%,color-mix(in_oklch,var(--secondary)_18%,transparent),transparent_50%)]"
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageIcon className="size-8 opacity-60" aria-hidden />
              <span className="text-[0.65rem] font-bold tracking-[0.14em] uppercase">
                No image
              </span>
            </div>
          </>
        )}

        <span
          className={cn(
            'absolute top-3 left-3 rounded-md px-2 py-1 text-[0.6rem] font-bold tracking-wider uppercase ring-1',
            statusClass(status),
            status === 'open' && 'animate-pulse',
          )}
        >
          {statusLabel(status)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
            <Link
              to="/voting/$voteId"
              params={{ voteId: cause.id.toString() }}
              className="hover:text-primary"
            >
              {cause.reason}
            </Link>
          </h2>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDaysIcon className="size-3.5 shrink-0" aria-hidden />
            {formatVoteDateRange(cause)}
          </p>
        </div>

        {status === 'open' ? (
          <Link
            to="/voting/$voteId/vote"
            params={{ voteId: cause.id.toString() }}
            search={{ view: undefined }}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-emerald-600"
          >
            Vote
            <ChevronRightIcon className="size-4" aria-hidden />
          </Link>
        ) : status === 'ended' ? (
          <Link
            to="/voting/$voteId/vote"
            params={{ voteId: cause.id.toString() }}
            search={{ view: undefined }}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 px-4 text-sm font-bold tracking-wide text-muted-foreground uppercase transition-colors hover:bg-muted hover:text-foreground"
          >
            Results
            <ChevronRightIcon className="size-4" aria-hidden />
          </Link>
        ) : (
          <Link
            to="/voting/$voteId"
            params={{ voteId: cause.id.toString() }}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 text-sm font-bold tracking-wide text-foreground uppercase transition-colors hover:bg-muted"
          >
            View
            <ChevronRightIcon className="size-4" aria-hidden />
          </Link>
        )}
      </div>
    </article>
  )
}
