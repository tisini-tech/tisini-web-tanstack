import { LeagueTopScorers } from '#/components/scores/leagues/league-top-scorers'
import { seasonTopscorersQueryOptions } from '#/data/scores'
import { normalizeSeasonId, parseLeagueSlug } from '#/lib/leagues'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

const leagueRoute = getRouteApi('/livescores/leagues/$leagueId')

export const Route = createFileRoute('/livescores/leagues/$leagueId/scorers')({
  loader: async ({ params, context, location }) => {
    const { id } = parseLeagueSlug(params.leagueId)
    const season =
      normalizeSeasonId(
        new URLSearchParams(location.searchStr).get('season'),
      ) ?? ''

    if (id && season) {
      await context.queryClient.ensureQueryData(
        seasonTopscorersQueryOptions(id, season),
      )
    }

    return {}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { tournId, league } = leagueRoute.useLoaderData()
  const { season } = leagueRoute.useSearch()

  if (!league || !season) return null

  return (
    <LeagueTopScorers tournId={tournId} season={season} type={league.type} />
  )
}
