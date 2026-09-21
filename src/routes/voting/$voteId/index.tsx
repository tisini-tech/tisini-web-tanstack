import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { getVoteParticipantsFn } from '#/data/voting'
import { VoteResults } from '#/components/voting/results'
import { SlateVoting } from '#/components/voting/slate-voting'
import { SingleVoting } from '#/components/voting/single-voting'
import { getVoteStatus } from '#/components/voting/voting-causes'
import { resolveHasVoted } from '#/components/voting/voting-session'
import { absoluteUrl, resolveOgImage } from '#/lib/seo'

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
