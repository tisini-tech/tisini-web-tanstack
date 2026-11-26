import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { absoluteUrl } from '#/lib/seo'
import { getVoteCausesFn } from '#/data/voting'
import FeaturedCauses from '#/components/voting/featured-causes'
import {
  sortVoteCauses,
  VotingCauses,
} from '#/components/voting/voting-causes'

export const Route = createFileRoute('/voting/')({
  loader: async () => {
    const causes = await getVoteCausesFn()
    return { causes }
  },
  component: VotingPage,
  head: () => ({
    title: 'Voting | Tisini',
    description: 'Vote for the cause you want to support.',
    links: [
      {
        rel: 'canonical',
        href: absoluteUrl('/voting'),
      },
    ],
    meta: [
      {
        name: 'description',
        content: 'Vote for the cause you want to support.',
      },
    ],
  }),
})

function VotingPage() {
  const { causes } = Route.useLoaderData()
  const sorted = useMemo(() => sortVoteCauses(causes), [causes])
  const featured = sorted.slice(0, 3)
  const others = sorted.slice(3)

  return (
    <section className="py-8">
      <header className="mb-8 text-center sm:mb-10">
        <h1 className="font-heading text-[clamp(1.35rem,4.2vw,3rem)] leading-[1.05] font-bold tracking-tight text-foreground">
          <span className="block whitespace-nowrap">Who gets your vote?</span>
          <span className="mt-1 block text-emerald-800/80 dark:text-emerald-400/55">
            Make the call.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Vote for the cause you want to support.
        </p>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-foreground">No votes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Fan votes will appear here when a poll is published.
          </p>
        </div>
      ) : (
        <>
          <FeaturedCauses causes={featured} />
          {others.length > 0 ? (
            <div className="mt-14 sm:mt-16">
              <VotingCauses causes={others} />
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
