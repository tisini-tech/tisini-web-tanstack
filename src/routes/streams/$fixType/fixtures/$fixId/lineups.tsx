import { StreamTeamLineup } from '#/components/streams/stream-team-lineup'
import {
  fixtureDetailsQueryOptions,
  fixtureLineupsQueryOptions,
} from '#/data/scores'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export type LineupsSearch = {
  isHome?: boolean
}

export const Route = createFileRoute(
  '/streams/$fixType/fixtures/$fixId/lineups',
)({
  validateSearch: (search: Record<string, unknown> = {}): LineupsSearch => {
    const raw = search.isHome
    return {
      isHome:
        raw === true || raw === 'true'
          ? true
          : raw === false || raw === 'false'
            ? false
            : undefined,
    }
  },
  loaderDeps: ({ search: { isHome } }) => ({ isHome }),
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        fixtureLineupsQueryOptions(params.fixId),
      ),
    ])
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { fixId } = Route.useParams()
  const { isHome = true } = Route.useSearch()

  const { data: lineups } = useSuspenseQuery(fixtureLineupsQueryOptions(fixId))
  const { data: details } = useSuspenseQuery(fixtureDetailsQueryOptions(fixId))

  const players = isHome ? (lineups.home ?? []) : (lineups.away ?? [])
  const teamName = isHome
    ? details.fixture.team1_name
    : details.fixture.team2_name
  const teamLogo = isHome
    ? details.fixture.team1_logo
    : details.fixture.team2_logo
  const leagueName = details.fixture.league

  console.log(lineups)

  return (
    <main className="h-screen w-screen overflow-hidden">
      <StreamTeamLineup
        teamName={teamName}
        players={players}
        teamLogo={teamLogo}
        leagueName={leagueName}
        // Placeholder until league logo is available from the API
        leagueLogo={null}
      />
    </main>
  )
}
