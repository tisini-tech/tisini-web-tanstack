import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  ClockIcon,
} from 'lucide-react'

import { getVoteParticipantsFn } from '#/data/voting'
import { getVoteStatus } from '#/components/voting/voting-causes'
import { resolveHasVoted } from '#/components/voting/voting-session'
import { absoluteUrl, resolveOgImage } from '#/lib/seo'
import { resolveMediaUrl } from '#/lib/utils'

export const Route = createFileRoute('/voting/$voteId/')({
  loader: async ({ params }) => {
    const poll = await getVoteParticipantsFn({
      data: { causeId: Number(params.voteId) },
    })

    return {
      poll: {
        id: poll.id,
        reason: poll.reason,
        image_url: poll.image_url,
        date_from: poll.date_from,
        date_to: poll.date_to,
        total_votes: poll.total_votes,
        has_voted: poll.has_voted,
        picks_required: poll.picks_required,
        vote_mode: poll.vote_mode,
        ballots_casted: poll.ballots_casted,
        formation_name: poll.formation?.name ?? null,
        option_count: poll.participants?.length ?? 0,
      },
    }
  },
  head: ({ loaderData, params }) => {
    const poll = loaderData?.poll
    const title = poll?.reason?.trim()
    const pageTitle = title ? `${title} | Voting | Tisini` : 'Voting | Tisini'
    const description =
      title != null && title !== ''
        ? `Cast your vote in "${title}" on Tisini.`
        : 'Cast your vote on Tisini.'
    const canonical = absoluteUrl(`/voting/${params.voteId}`)
    const image = resolveOgImage(poll?.image_url)
    const ogTitle = title || 'Voting | Tisini'

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

function formatVoteDate(value: string) {
  const parsed = new Date(value)
  const date = Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatCount(count: number) {
  return new Intl.NumberFormat('en-GB').format(count)
}

function RouteComponent() {
  const { poll } = Route.useLoaderData()
  const [now, setNow] = useState(() => new Date())
  const [hasVoted, setHasVoted] = useState(poll.has_voted)
  const status = getVoteStatus(poll, now)
  const image = resolveMediaUrl(poll.image_url)
  const isSlate = poll.vote_mode?.trim().toLowerCase() === 'slate'
  const startsAt = new Date(poll.date_from)

  useEffect(() => {
    setHasVoted(resolveHasVoted(poll.id, poll.has_voted))
  }, [poll.has_voted, poll.id])

  useEffect(() => {
    if (status !== 'upcoming') return
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [status])

  const msRemaining = startsAt.getTime() - now.getTime()
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000))
  const days = Math.floor(totalSeconds / 86_400)
  const hours = Math.floor((totalSeconds % 86_400) / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)

  const howToVote = isSlate
    ? poll.picks_required
      ? `Pick ${poll.picks_required}${poll.formation_name ? ` · ${poll.formation_name}` : ''}`
      : 'Lineup vote'
    : 'Choose one'

  return (
    <div className="sp-content-shell py-6">
      <Link
        to="/voting"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden />
        All votes
      </Link>

      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-border bg-muted/40 sm:aspect-[21/9]">
          {image ? (
            <img src={image} alt="" className="size-full object-cover" />
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
              Voting
            </p>
            <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {poll.reason}
            </h1>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2 text-muted-foreground">
              <CalendarDaysIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
              <div>
                <dt className="text-[0.65rem] font-semibold tracking-[0.1em] uppercase">
                  Open
                </dt>
                <dd className="text-foreground">
                  {formatVoteDate(poll.date_from)} – {formatVoteDate(poll.date_to)}
                </dd>
              </div>
            </div>
            <div>
              <dt className="text-[0.65rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                How to vote
              </dt>
              <dd className="text-foreground">{howToVote}</dd>
            </div>
            {poll.option_count > 0 ? (
              <div>
                <dt className="text-[0.65rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  Options
                </dt>
                <dd className="text-foreground">
                  {poll.option_count}{' '}
                  {poll.option_count === 1 ? 'option' : 'options'}
                </dd>
              </div>
            ) : null}
            {status === 'ended' && poll.total_votes > 0 ? (
              <div>
                <dt className="text-[0.65rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                  Votes
                </dt>
                <dd className="text-foreground">{formatCount(poll.total_votes)}</dd>
              </div>
            ) : null}
          </dl>

          {status === 'open' && !hasVoted ? (
            <Link
              to="/voting/$voteId/vote"
              params={{ voteId: poll.id.toString() }}
              className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-500 px-4 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-emerald-600 sm:w-fit"
            >
              Vote
              <ChevronRightIcon className="size-4" aria-hidden />
            </Link>
          ) : status === 'upcoming' ? (
            <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-muted/20 px-4 text-sm font-semibold text-primary">
              <ClockIcon className="size-4" aria-hidden />
              Starts in{' '}
              {days > 0
                ? `${days}d ${hours}h`
                : `${hours}h ${minutes.toString().padStart(2, '0')}m`}
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {hasVoted && status === 'open' ? (
                <p className="text-sm text-muted-foreground">
                  You have already voted in this poll.
                </p>
              ) : null}
              <Link
                to="/voting/$voteId/vote"
                params={{ voteId: poll.id.toString() }}
                search={
                  status === 'open' && hasVoted && !isSlate
                    ? { view: 'results' }
                    : {}
                }
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/40 px-4 text-sm font-bold tracking-wide text-foreground uppercase transition-colors hover:bg-muted"
              >
                {status === 'ended' || !isSlate ? 'Results' : 'Your vote'}
                <ChevronRightIcon className="size-4" aria-hidden />
              </Link>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
