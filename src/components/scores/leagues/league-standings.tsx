import { useQuery } from '@tanstack/react-query'
import { LeagueStandingsTable } from '#/components/scores/leagues/league-standings-table'
import { seasonStandingsQueryOptions } from '#/data/scores'

type LeagueStandingsProps = {
  tournId: string
  season: string
}

export function LeagueStandings({ tournId, season }: LeagueStandingsProps) {
  const { data, isLoading, isError } = useQuery(
    seasonStandingsQueryOptions(tournId, season),
  )

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-48 items-center justify-center font-heading text-sm text-red-400">
        Could not load standings. Please try again.
      </div>
    )
  }

  const standings = data?.standings

  if (!standings?.length) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        No standings yet!
      </div>
    )
  }

  return <LeagueStandingsTable standings={standings} tournId={tournId} />
}
