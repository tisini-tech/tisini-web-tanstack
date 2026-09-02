import { FixtureOverview } from '#/components/scores/fixture-overview'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const scoreRoute = getRouteApi('/livescores/$fixtureType/$fixtureId')

export const Route = createFileRoute(
  '/livescores/$fixtureType/$fixtureId/overview',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { fixtureDetails } = scoreRoute.useLoaderData()

  return (
    <FixtureOverview
      teams={fixtureDetails.fixture}
      highlights={fixtureDetails.highlights}
    />
  )
}
