import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { cn } from '#/lib/utils'
import FixtureRow from '#/components/scores/fixture-row'
import {
  fixtureDatesQueryOptions,
  fixturesByDateQueryOptions,
} from '#/data/scores'
import {
  groupFixtures,
  normalizeFixtureDate,
  resolveFixtureDate,
} from '#/lib/scores'

export type LivescoresFixtureSearch = {
  date?: string
}

export const Route = createFileRoute('/livescores/$fixtureType/')({
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
    const { fixtureType } = params

    const fixtureDates = await context.queryClient.ensureQueryData(
      fixtureDatesQueryOptions(fixtureType),
    )

    const selectedDate = resolveFixtureDate(fixtureDates, deps.date)

    await context.queryClient.ensureQueryData(
      fixturesByDateQueryOptions(fixtureType, selectedDate),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { fixtureType } = Route.useParams()
  const { date: searchDate } = Route.useSearch()

  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()

  const { data: fixtureDates } = useSuspenseQuery(
    fixtureDatesQueryOptions(fixtureType),
  )

  const selectedDate = resolveFixtureDate(fixtureDates, searchDate)

  const { data: fixtures = [] } = useSuspenseQuery(
    fixturesByDateQueryOptions(fixtureType, selectedDate),
  )

  const groupedFixtures = groupFixtures(fixtures)

  if (!searchDate && selectedDate) {
    return (
      <Navigate
        to="/livescores/$fixtureType"
        params={{ fixtureType }}
        search={{ date: selectedDate }}
        replace
      />
    )
  }

  return (
    <section className="flex flex-col gap-3 p-3 sm:p-4">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {fixtureDates.map((date) => {
          const active =
            normalizeFixtureDate(selectedDate) === normalizeFixtureDate(date)
          return (
            <button
              key={date}
              type="button"
              onClick={() => {
                navigate({
                  to: '.',
                  search: { date },
                  replace: true,
                })
              }}
              onMouseEnter={() => {
                queryClient.prefetchQuery(
                  fixturesByDateQueryOptions(fixtureType, date),
                )
              }}
              className={cn(
                'shrink-0 rounded-lg border px-3 py-2 font-mono text-xs tracking-wide transition-colors sm:text-sm',
                active
                  ? 'border-emerald-400/50 bg-emerald-500/15 font-semibold text-accent-foreground'
                  : 'border-border text-muted-foreground hover:border-border hover:text-foreground',
              )}
            >
              {formatDateTab(date)}
            </button>
          )
        })}
      </div>

      {!fixtures.length ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No fixtures for this date.
        </div>
      ) : (
        Object.entries(groupedFixtures).map(([league, divisions]) => (
          <div
            key={league}
            className="rounded-lg border border-border bg-muted/20"
          >
            <div className="border-b border-border px-3 py-2 font-heading text-sm font-semibold text-accent-foreground">
              {league}
            </div>

            {Object.entries(divisions).map(([category, leagueFixtures]) => (
              <div key={category || 'default'}>
                {category ? (
                  <div className="border-b border-white/5 px-3 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                    {category}
                  </div>
                ) : null}

                <div>
                  {leagueFixtures.map((fixture) => (
                    <FixtureRow key={fixture.id} fixture={fixture} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </section>
  )
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function formatDateTab(date: string) {
  const input = new Date(date)
  if (Number.isNaN(input.getTime())) return date
  const parts = date.split('-')
  const day = parts[2] ?? String(input.getDate()).padStart(2, '0')
  const month = MONTHS[input.getMonth()] ?? ''
  return `${day} ${month}`
}
