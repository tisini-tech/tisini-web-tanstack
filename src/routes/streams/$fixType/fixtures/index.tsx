import type { LivescoresFixtureSearch } from '#/routes/livescores/$fixtureType'
import { normalizeFixtureDate, resolveFixtureDate } from '#/lib/scores'
import { createFileRoute } from '@tanstack/react-router'
import {
  fixtureDatesQueryOptions,
  fixturesByDateQueryOptions,
} from '#/data/scores'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useDeferredValue, useState } from 'react'
import { StreamFixture } from '#/components/streams/stream-fixture'
import type { Fixture } from '#/lib/types'

export const Route = createFileRoute('/streams/$fixType/fixtures/')({
  validateSearch: (
    search: Record<string, unknown> = {},
  ): LivescoresFixtureSearch => ({
    date:
      typeof search.date === 'string'
        ? normalizeFixtureDate(search.date)
        : undefined,
  }),
  loaderDeps: ({ search: { date } }) => ({
    date: normalizeFixtureDate(date),
  }),
  loader: async ({ context, params, deps }) => {
    const { fixType } = params

    const fixtureDates = await context.queryClient.ensureQueryData(
      fixtureDatesQueryOptions(fixType),
    )

    const selectedDate = resolveFixtureDate(fixtureDates, deps.date)

    await context.queryClient.ensureQueryData(
      fixturesByDateQueryOptions(fixType, selectedDate),
    )
  },
  component: RouteComponent,
})

function matchesFixtureQuery(fixture: Fixture, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const haystack = [
    fixture.team1_name,
    fixture.team2_name,
    fixture.team1_short_name,
    fixture.team2_short_name,
    fixture.league_name,
    fixture.league,
    fixture.category_name,
    String(fixture.id),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(q)
}

function RouteComponent() {
  const { fixType } = Route.useParams()
  const { date: searchDate } = Route.useSearch()

  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const { data: fixtureDates } = useSuspenseQuery(
    fixtureDatesQueryOptions(fixType),
  )

  const selectedDate = resolveFixtureDate(fixtureDates, searchDate)

  const { data: fixtures = [] } = useSuspenseQuery(
    fixturesByDateQueryOptions(fixType, selectedDate),
  )

  const filteredFixtures = fixtures.filter((fixture) =>
    matchesFixtureQuery(fixture, deferredQuery),
  )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-4 sm:p-6">
        <div className="sticky top-0 z-10 -mx-4 bg-[#39FF14]/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6">
          <label className="block">
            <span className="sr-only">Search fixtures</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search team, league, or match…"
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-[#023270]/40 focus:ring-2 focus:ring-[#023270]/20 focus:outline-none"
            />
          </label>
        </div>

        {fixtures.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-3xl text-zinc-900">
            No data!
          </div>
        ) : filteredFixtures.length === 0 ? (
          <div className="rounded-xl bg-white/90 px-4 py-8 text-center text-sm font-medium text-zinc-700">
            No matches for “{query.trim()}”.
          </div>
        ) : (
          filteredFixtures.map((fixture) => (
            <StreamFixture
              key={fixture.id}
              fixture={fixture}
              fixtureType={fixType}
            />
          ))
        )}
      </section>
    </Suspense>
  )
}
