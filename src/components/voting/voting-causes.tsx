import { Link } from '@tanstack/react-router'
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  ImageIcon,
  SearchIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import type { VoteCause } from '#/lib/types'
import { cn } from '#/lib/utils'

const PAGE_SIZE = 12

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

export function sortVoteCauses(causes: VoteCause[]): VoteCause[] {
  return [...causes].sort((a, b) => {
    const statusOrder = { open: 0, upcoming: 1, ended: 2 }
    const statusDiff =
      statusOrder[getVoteStatus(a)] - statusOrder[getVoteStatus(b)]
    if (statusDiff !== 0) return statusDiff
    return (
      parseVoteDate(b.date_from).getTime() -
      parseVoteDate(a.date_from).getTime()
    )
  })
}

export function formatVoteDateRange(cause: VoteCause): string {
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

export function VotingCauses({ causes }: { causes: VoteCause[] }) {
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE_SIZE)
  const sorted = useMemo(() => sortVoteCauses(causes), [causes])
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return sorted
    return sorted.filter((cause) =>
      cause.reason.toLowerCase().includes(needle),
    )
  }, [sorted, query])

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Other votes
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? 'vote' : 'votes'}
            {query.trim() ? ' found' : ' available'}
          </p>
        </div>

        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Search votes</span>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setShown(PAGE_SIZE)
            }}
            placeholder="Search votes"
            className="h-12 w-full rounded-xl border border-border bg-muted/30 pr-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-foreground">
            {query.trim()
              ? `No votes match “${query.trim()}”`
              : 'No other votes right now'}
          </p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.slice(0, shown).map((cause) => (
              <li key={cause.id} className="min-w-0">
                <VoteCauseCard cause={cause} />
              </li>
            ))}
          </ul>
          {shown < visible.length ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShown((count) => count + PAGE_SIZE)}
                className="inline-flex h-11 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                More
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}

function VoteCauseCard({ cause }: { cause: VoteCause }) {
  const status = getVoteStatus(cause)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-square overflow-hidden border-b border-border bg-[#120818]">
        {cause.image_url ? (
          <img
            src={cause.image_url}
            alt=""
            className="absolute inset-0 size-full object-cover"
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
