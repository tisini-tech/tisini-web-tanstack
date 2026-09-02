import { useQuery } from '@tanstack/react-query'
import { FootballTopScorers } from '#/components/scores/football-top-scorers'
import { seasonTopscorersQueryOptions } from '#/data/scores'

type LeagueTopScorersProps = {
  tournId: string
  season: string
  type: string
}

export function LeagueTopScorers({
  tournId,
  season,
  type,
}: LeagueTopScorersProps) {
  const { data, isLoading, isError } = useQuery(
    seasonTopscorersQueryOptions(tournId, season),
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
        Could not load top scorers. Please try again.
      </div>
    )
  }

  const players = data ?? []

  if (type === 'football') {
    return <FootballTopScorers players={players} />
  }

  // Rugby / other sports — reuse goals column for now
  return <FootballTopScorers players={players} />
}
