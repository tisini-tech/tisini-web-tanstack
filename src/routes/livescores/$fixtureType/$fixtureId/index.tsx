import BasketballStats from '#/components/scores/stats/basketball-stats'
import FootballStats from '#/components/scores/stats/football-stats'
import RugbyStats from '#/components/scores/stats/rugby-stats'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const scoreRoute = getRouteApi('/livescores/$fixtureType/$fixtureId')

export const Route = createFileRoute('/livescores/$fixtureType/$fixtureId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { fixtureType } = scoreRoute.useParams()
  const { fixtureDetails } = scoreRoute.useLoaderData()

  const homeStats = fixtureDetails.stats.home
  const awayStats = fixtureDetails.stats.away

  if (fixtureType === 'football') {
    return <FootballStats home={homeStats} away={awayStats} />
  }

  if (fixtureType === 'basketball') {
    return <BasketballStats home={homeStats} away={awayStats} />
  }

  return <RugbyStats home={homeStats} away={awayStats} />
}
