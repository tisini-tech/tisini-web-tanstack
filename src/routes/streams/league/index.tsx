import {
  keepPreviousData,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import { StreamLowerThird } from '#/components/streams/stream-lower-third'
import { StreamMatchStats } from '#/components/streams/stream-match-stats'
import {
  fixtureDetailsQueryOptions,
  seasonFixturesQueryOptions,
} from '#/data/scores'
import { pickActiveFixtureId } from '#/lib/league-stream'

/** Same competition the old `/streams/league` overlay used. */
const DEFAULT_TOURN = '253'
const DEFAULT_SEASON = '294'

type LeagueStreamSearch = {
  tourn: string
  season: string
  lowerThird: boolean
}

export const Route = createFileRoute('/streams/league/')({
  validateSearch: (search: Record<string, unknown>): LeagueStreamSearch => ({
    tourn:
      typeof search.tourn === 'string' && search.tourn.trim()
        ? search.tourn.trim()
        : DEFAULT_TOURN,
    season:
      typeof search.season === 'string' && search.season.trim()
        ? search.season.trim()
        : DEFAULT_SEASON,
    lowerThird:
      search.lowerThird === true ||
      search.lowerThird === 'true' ||
      search.lowerThird === '1' ||
      search.lowerThird === '',
  }),
  loaderDeps: ({ search: { tourn, season } }) => ({ tourn, season }),
  loader: async ({ context, deps }) => {
    const fixtures = await context.queryClient.ensureQueryData(
      seasonFixturesQueryOptions(deps.tourn, deps.season),
    )
    const activeId = pickActiveFixtureId(fixtures ?? [])
    if (activeId) {
      await context.queryClient.ensureQueryData(
        fixtureDetailsQueryOptions(activeId),
      )
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { tourn, season, lowerThird } = Route.useSearch()

  const { data: fixtures = [] } = useSuspenseQuery({
    ...seasonFixturesQueryOptions(tourn, season),
    refetchInterval: 10_000,
  })

  const activeFixtureId = useMemo(
    () => pickActiveFixtureId(fixtures),
    [fixtures],
  )

  const { data: fixtureDetails, isLoading: detailsLoading } = useQuery({
    ...fixtureDetailsQueryOptions(activeFixtureId ?? ''),
    enabled: Boolean(activeFixtureId),
    refetchInterval: 10_000,
    placeholderData: keepPreviousData,
  })

  const fixType = fixtureDetails?.fixture.fixture_type || 'rugby7'

  return (
    <div className="min-h-screen w-full bg-[#39FF14] text-white">
      {!activeFixtureId ? (
        <main className="flex min-h-screen items-center justify-center px-4">
          <p className="text-xl font-bold tracking-wide text-zinc-900 uppercase">
            Waiting for next match
          </p>
        </main>
      ) : detailsLoading && !fixtureDetails ? (
        <main className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#023270]/30 border-t-[#023270]" />
        </main>
      ) : fixtureDetails ? (
        lowerThird ? (
          <StreamLowerThird details={fixtureDetails} fixType={fixType} />
        ) : (
          <StreamMatchStats details={fixtureDetails} fixType={fixType} />
        )
      ) : null}
    </div>
  )
}
