import FootballLineups from '#/components/scores/lineups/FootballLineups'
import RugbyLineups from '#/components/scores/lineups/RugbyLineups'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const scoreRoute = getRouteApi('/livescores/$fixtureType/$fixtureId')

export const Route = createFileRoute(
  '/livescores/$fixtureType/$fixtureId/lineups',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { fixtureType } = scoreRoute.useParams()
  const { fixtureLineups } = scoreRoute.useLoaderData()

  if (fixtureType === 'football') {
    return <FootballLineups squads={fixtureLineups} />
  }

  return <RugbyLineups squads={fixtureLineups} />
}
