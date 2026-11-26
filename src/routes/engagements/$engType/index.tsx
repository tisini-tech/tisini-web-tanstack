import { useMemo } from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { getEngagementsFn } from '#/data/quiz'
import EngagementsList from '#/components/engagements/engagements-list'
import FeaturedEngagements from '#/components/engagements/featured-engagements'
import type { EngagementSection } from '#/components/engagements/engagement-card'

function parseEngType(value: string): EngagementSection {
  if (value === 'quiz' || value === 'tanobora') return value
  throw notFound()
}

export const Route = createFileRoute('/engagements/$engType/')({
  params: {
    parse: (params) => ({
      engType: parseEngType(params.engType),
    }),
  },
  loader: async ({ params }) => {
    const type = params.engType === 'quiz' ? 'QZ' : 'PR'
    const engagements = await getEngagementsFn({ data: { type } })

    return { engagements }
  },
  head: ({ params }) => {
    const description =
      params.engType === 'tanobora'
        ? 'Predict five events in the match — cards, goals, and the moments in between.'
        : 'Think you know the game? Prove it in a Tisini quiz.'
    const title =
      params.engType === 'tanobora' ? 'Tano Bora | Tisini' : 'Quiz | Tisini'

    return {
      title,
      description,
      links: [
        {
          rel: 'canonical',
          href: `https://tisini.com/engagements/${params.engType}`,
        },
      ],
      meta: [{ name: 'description', content: description }],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { engType } = Route.useParams()

  const { engagements } = Route.useLoaderData()

  const published = useMemo(
    () =>
      engagements.filter(
        (engagement) =>
          engagement.is_public && engagement.status.toUpperCase() !== 'DR',
      ),
    [engagements],
  )

  // const others = useMemo(() => {
  //   const featuredIds = new Set(featured.map((quiz) => quiz.id))
  //   const rest = sortQuizzes(
  //     published.filter((quiz) => !featuredIds.has(quiz.id)),
  //   )
  //   const needle = query.trim().toLowerCase()
  //   if (!needle) return rest
  //   return rest.filter((quiz) =>
  //     [quiz.title, quiz.description, quiz.prize_description]
  //       .filter(Boolean)
  //       .join(' ')
  //       .toLowerCase()
  //       .includes(needle),
  //   )
  // }, [published, featured, query])

  return (
    <section className="py-8">
      <header className="mb-8 text-center sm:mb-10">
        <h1 className="font-heading text-[clamp(1.35rem,4.2vw,3rem)] leading-[1.05] font-bold tracking-tight text-foreground">
          <span className="block whitespace-nowrap">
            {engType === 'tanobora'
              ? 'Five events in the match.'
              : 'Think you know the game?'}
          </span>
          <span className="mt-1 block text-emerald-800/80 dark:text-emerald-400/55">
            {engType === 'tanobora' ? 'Can you call them?' : 'Prove it.'}
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {engType === 'tanobora'
            ? 'Predict what happens in the fixture — cards, goals, and the moments in between.'
            : 'Play the open round and see how well you follow the game.'}
        </p>
      </header>

      <FeaturedEngagements
        type={engType}
        engagements={engagements.slice(0, 3)}
      />

      {published.length > 0 ? (
        <div className="mt-14 sm:mt-16">
          <EngagementsList type={engType} engagements={engagements} />
        </div>
      ) : (
        <div className="mt-14 rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center sm:mt-16">
          <p className="text-sm font-semibold text-foreground">
            No published quizzes yet
          </p>
        </div>
      )}
    </section>
  )
}
