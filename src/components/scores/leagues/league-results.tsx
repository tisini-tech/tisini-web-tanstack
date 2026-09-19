import { useQuery } from '@tanstack/react-query'
import {
  groupFixturesByMatchday,
  sortMatchdaysForResults,
} from '@/lib/scores'
import FixtureRow from '@/components/scores/fixture-row'
import { seasonFixturesQueryOptions } from '#/data/scores'

type LeagueResultsProps = {
  tournId: string
  season: string
}

export function LeagueResults({ tournId, season }: LeagueResultsProps) {
  const { data, isLoading, isError } = useQuery(
    seasonFixturesQueryOptions(tournId, season),
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
        Could not load fixtures. Please try again.
      </div>
    )
  }

  const fixtures = data ?? []

  if (fixtures.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center font-heading text-xl text-muted-foreground">
        No fixture data yet!
      </div>
    )
  }

  const matches = sortMatchdaysForResults(groupFixturesByMatchday(fixtures))

  return (
    <section className="space-y-4">
      {matches.map(([round, roundFixtures]) => (
        <div
          key={round}
          className="overflow-hidden rounded-lg border border-border"
        >
          <div className="border-b border-border bg-muted/40 px-4 py-2">
            <h3 className="font-heading text-sm font-semibold text-accent-foreground">
              {round}
            </h3>
          </div>

          <div className="divide-y divide-border">
            {roundFixtures.map((fixture) => (
              <FixtureRow key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
