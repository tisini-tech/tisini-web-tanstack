import type { LivescoresFixtureSearch } from '#/routes/livescores/$fixtureType'
import { normalizeFixtureDate, resolveFixtureDate } from '#/lib/scores'
import { createFileRoute } from '@tanstack/react-router'
import {
  fixtureDatesQueryOptions,
  fixturesByDateQueryOptions,
} from '#/data/scores'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { StreamFixture } from '#/components/streams/stream-fixture'

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

function RouteComponent() {
  const { fixType } = Route.useParams()
  const { date: searchDate } = Route.useSearch()

  const { data: fixtureDates } = useSuspenseQuery(
    fixtureDatesQueryOptions(fixType),
  )

  const selectedDate = resolveFixtureDate(fixtureDates, searchDate)

  const { data: fixtures = [] } = useSuspenseQuery(
    fixturesByDateQueryOptions(fixType, selectedDate),
  )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 p-4 sm:p-6">
        {fixtures?.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-3xl text-white">
            No data!
          </div>
        ) : (
          fixtures!.map((fixture) => (
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
