import { ArrowLeftIcon } from 'lucide-react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { getQuizLeaderboardFn } from '#/data/quiz'
import type { EngagementSection } from '#/components/engagements/engagement-card'
import { EngagementLeaderboardTable } from '#/components/engagements/leaderboard'

function parseEngType(value: string): EngagementSection {
  if (value === 'quiz' || value === 'tanobora') return value
  throw notFound()
}

export const Route = createFileRoute(
  '/engagements/$engType/$engagementId/leaderboard',
)({
  params: {
    parse: (params) => ({
      ...params,
      engType: parseEngType(params.engType),
    }),
  },
  loader: async ({ params }) => {
    const engagementId = params.engagementId
    if (!engagementId) {
      throw new Error('Engagement ID is required')
    }

    const leaderboard = await getQuizLeaderboardFn({
      data: { quizId: engagementId },
    })

    return { leaderboard: leaderboard.results }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { engType, engagementId } = Route.useParams()
  const { leaderboard } = Route.useLoaderData()

  return (
    <div className="py-6">
      <Link
        to="/engagements/$engType"
        params={{ engType }}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-3.5" aria-hidden />
        All {engType}
      </Link>

      <div className="mb-5">
        <h1 className="text-[0.65rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          Leaderboard
        </h1>
        <p className="mt-1 text-sm text-foreground/90">Quiz #{engagementId}</p>
      </div>

      <EngagementLeaderboardTable entries={leaderboard} type={engType} />
    </div>
  )
}
