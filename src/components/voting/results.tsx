import { ImageIcon, TrophyIcon } from 'lucide-react'

import { SlateVoteResults } from '#/components/voting/slate-results'
import type { Participant, VoteParticipant } from '#/lib/types'
import { cn } from '#/lib/utils'

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function formatVotes(count: number): string {
  return new Intl.NumberFormat('en-GB').format(count)
}

function teamLabel(participant: Participant): string | null {
  return participant.team_name || participant.description || null
}

export function VoteResults({ poll }: { poll: VoteParticipant }) {
  if (poll.vote_mode?.trim().toLowerCase() === 'slate') {
    return <SlateVoteResults poll={poll} />
  }

  const ranked = [...poll.participants].sort(
    (a, b) => b.total_votes - a.total_votes,
  )
  const maxVotes = ranked[0]?.total_votes ?? 0
  const totalVotes =
    poll.total_votes || ranked.reduce((sum, p) => sum + p.total_votes, 0)

  return (
    <div className="space-y-5">
      <header className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border/60 bg-muted/15 px-4 py-4 sm:px-5">
          <p className="text-[0.65rem] font-bold tracking-[0.12em] text-emerald-500 uppercase dark:text-emerald-400">
            Results
          </p>
          <h1 className="mt-1 font-heading text-xl font-black tracking-tight text-foreground uppercase sm:text-2xl">
            {poll.reason}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatVotes(totalVotes)} total{' '}
            {totalVotes === 1 ? 'vote' : 'votes'}
          </p>
        </div>
      </header>

      {ranked.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-foreground">
            No results yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Participants will appear here once voting data is available.
          </p>
        </div>
      ) : (
        <ol className="space-y-2.5">
          {ranked.map((participant, index) => (
            <ResultRow
              key={participant.id}
              participant={participant}
              rank={index + 1}
              maxVotes={maxVotes}
              totalVotes={totalVotes}
            />
          ))}
        </ol>
      )}
    </div>
  )
}

function ResultRow({
  participant,
  rank,
  maxVotes,
  totalVotes,
}: {
  participant: Participant
  rank: number
  maxVotes: number
  totalVotes: number
}) {
  const isWinner = rank === 1
  const share =
    totalVotes > 0
      ? Math.round((participant.total_votes / totalVotes) * 100)
      : 0
  const barWidth = maxVotes > 0 ? (participant.total_votes / maxVotes) * 100 : 0
  const team = teamLabel(participant)

  return (
    <li
      className={cn(
        'overflow-hidden rounded-2xl border bg-card shadow-sm',
        isWinner
          ? 'border-emerald-500/40 ring-1 ring-emerald-500/25'
          : 'border-border',
      )}
    >
      <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5 sm:gap-4 sm:px-5 sm:pt-4">
        <span
          className={cn(
            'inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums',
            isWinner
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {isWinner ? (
            <TrophyIcon className="size-4" aria-hidden />
          ) : (
            rank
          )}
        </span>

        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted/50 sm:size-14">
          {participant.image_url ? (
            <img
              src={participant.image_url}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground">
              <ImageIcon className="size-4 opacity-70" aria-hidden />
              <span className="text-[0.6rem] font-bold tracking-wide">
                {getInitials(participant.name) || '—'}
              </span>
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground sm:text-base">
            {participant.name}
          </p>
          {team ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {team}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p
            className={cn(
              'text-lg font-black tabular-nums sm:text-xl',
              isWinner
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-foreground',
            )}
          >
            {formatVotes(participant.total_votes)}
          </p>
          <p className="text-[0.65rem] font-semibold tabular-nums text-muted-foreground">
            {share}%
          </p>
        </div>
      </div>

      <div className="px-4 pb-3.5 sm:px-5 sm:pb-4">
        <div
          className="h-2.5 overflow-hidden rounded-full bg-muted"
          role="meter"
          aria-valuenow={share}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${share}% of votes`}
        >
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-500',
              isWinner
                ? 'bg-emerald-500'
                : 'bg-sky-500/85 dark:bg-sky-400/80',
            )}
            style={{ width: `${Math.max(barWidth, share > 0 ? 4 : 0)}%` }}
          />
        </div>
      </div>
    </li>
  )
}
