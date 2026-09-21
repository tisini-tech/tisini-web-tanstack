import { normalizeSeasonId, parseLeagueSlug } from '#/lib/leagues'
import { seasonTopAssistsQueryOptions } from '#/data/scores'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TopPerformers } from '#/components/scores/football-top-scorers'
import { Suspense } from 'react'

const leagueRoute = getRouteApi('/livescores/leagues/$leagueId')

export const Route = createFileRoute('/livescores/leagues/$leagueId/assists')({
  loader: async ({ params, context, location }) => {
    const { id } = parseLeagueSlug(params.leagueId)
    const season =
      normalizeSeasonId(
        new URLSearchParams(location.searchStr).get('season'),
      ) ?? ''

    if (id && season) {
      await context.queryClient.ensureQueryData(
        seasonTopAssistsQueryOptions(id, season),
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

  return <LeagueTopAssists tournId={tournId} season={season} />
}

type LeagueTopAssistsProps = {
  tournId: string
  season: string
}

export function LeagueTopAssists({ tournId, season }: LeagueTopAssistsProps) {
  const { data: players } = useSuspenseQuery(
    seasonTopAssistsQueryOptions(tournId, season),
  )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopPerformers players={players} eventName="Assists" />
    </Suspense>
  )
}
