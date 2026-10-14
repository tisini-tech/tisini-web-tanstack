import FootballLineups from '#/components/scores/lineups/FootballLineups'
import RugbyLineups from '#/components/scores/lineups/RugbyLineups'
import { indexSubstitutions } from '#/lib/substitutions'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const scoreRoute = getRouteApi('/livescores/$fixtureType/$fixtureId')

export const Route = createFileRoute(
  '/livescores/$fixtureType/$fixtureId/lineups',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { fixtureType } = scoreRoute.useParams()
  const { fixtureLineups, fixtureDetails } = scoreRoute.useLoaderData()

  const fixture = fixtureDetails.fixture
  const highlights = fixtureDetails.highlights ?? []
  const homeSubs = indexSubstitutions(highlights, fixture.team1_id)
  const awaySubs = indexSubstitutions(highlights, fixture.team2_id)

  if (fixtureType === 'football') {
    return (
      <FootballLineups
        squads={fixtureLineups}
        homeSubs={homeSubs}
        awaySubs={awaySubs}
      />
    )
  }

  return (
    <RugbyLineups
      squads={fixtureLineups}
      homeSubs={homeSubs}
      awaySubs={awaySubs}
    />
  )
}
