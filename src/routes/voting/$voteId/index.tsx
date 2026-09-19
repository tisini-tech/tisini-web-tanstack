import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { getVoteParticipantsFn } from '#/data/voting'
import { VoteResults } from '#/components/voting/results'
import { SlateVoting } from '#/components/voting/slate-voting'
import { SingleVoting } from '#/components/voting/single-voting'
import { getVoteStatus } from '#/components/voting/voting-causes'
import { resolveHasVoted } from '#/components/voting/voting-session'

export const Route = createFileRoute('/voting/$voteId/')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      view: search.view === 'results' ? ('results' as const) : undefined,
    }
  },
  loader: async ({ params }) => {
    const poll = await getVoteParticipantsFn({
      data: { causeId: Number(params.voteId) },
    })
    return { poll }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { poll } = Route.useLoaderData()
  const { view } = Route.useSearch()
  const navigate = Route.useNavigate()

  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const status = getVoteStatus(poll)
  const isSlate = poll.vote_mode?.trim().toLowerCase() === 'slate'
  const mode = poll.vote_mode?.trim().toLowerCase()

  useEffect(() => {
    const voted = resolveHasVoted(poll.id, poll.has_voted)
    setAlreadyVoted(voted)
    setHydrated(true)

    if (!voted) return
    if (status === 'ended' || view === 'results') return
    // Slate polls stay on the success screen instead of results.
    if (isSlate) return

    void navigate({
      search: { view: 'results' },
      replace: true,
    })
  }, [isSlate, navigate, poll.has_voted, poll.id, status, view])

  const showResults =
    status === 'ended' || view === 'results' || (alreadyVoted && !isSlate)

  return (
    <div className="sp-content-shell py-6">
      <Link
        to="/voting"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden />
        All votes
      </Link>

      {showResults ? (
        <VoteResults poll={poll} />
      ) : !hydrated ? (
        <div
          className="rounded-2xl border border-border bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground"
          aria-busy="true"
        >
          Loading…
        </div>
      ) : mode === 'slate' ? (
        <SlateVoting poll={poll} />
      ) : (
        <SingleVoting poll={poll} />
      )}
    </div>
  )
}
