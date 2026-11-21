import { Suspense, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { normalizeSeasonId, parseLeagueSlug } from '#/lib/leagues'
import { rugbyCardColumnTotals } from '#/lib/rugby-highlight-metrics'
import { TopPerformers } from '#/components/scores/top-performers'
import type { TopPlayer } from '#/lib/types'
import {
  getSeasonCleanSheetsQueryOptions,
  seasonTopAssistsQueryOptions,
  seasonTopscorersQueryOptions,
  seasonTopTrysQueryOptions,
  seasonTopCardsQueryOptions,
  seasonTopPointsQueryOptions,
} from '#/data/scores'

const leagueRoute = getRouteApi('/livescores/leagues/$leagueId')

const stats = [
  {
    id: 'goals',
    label: 'Goals',
    kind: 'football',
    options: seasonTopscorersQueryOptions,
  },
  {
    id: 'assists',
    label: 'Assists',
    kind: 'football',
    options: seasonTopAssistsQueryOptions,
  },
  {
    id: 'cleansheets',
    label: 'Clean sheets',
    kind: 'football',
    options: getSeasonCleanSheetsQueryOptions,
  },
  {
    id: 'tries',
    label: 'Tries',
    kind: 'rugby',
    options: seasonTopTrysQueryOptions,
  },
  {
    id: 'points',
    label: 'Points',
    kind: 'rugby',
    options: seasonTopPointsQueryOptions,
  },
  {
    id: 'cards',
    label: 'Cards',
    kind: 'rugby',
    options: seasonTopCardsQueryOptions,
  },
] as const

type StatId = (typeof stats)[number]['id']

function statsForFixtureType(fixtureType: string | undefined) {
  const type = (fixtureType ?? '').toLowerCase()
  return stats.filter((stat) => type.includes(stat.kind))
}

export const Route = createFileRoute('/livescores/leagues/$leagueId/stats')({
  loader: async ({ params, context, location }) => {
    const { id, league } = parseLeagueSlug(params.leagueId)
    const statsTabs = statsForFixtureType(league?.type)
    const stat =
      statsTabs[Math.floor(Math.random() * statsTabs.length)]?.id ?? stats[0].id
    const season =
      normalizeSeasonId(
        new URLSearchParams(location.searchStr).get('season'),
      ) ?? ''
    const selected = stats.find((item) => item.id === stat) ?? stats[0]

    if (id && season) {
      await context.queryClient.ensureQueryData(selected.options(id, season))
    }

    return { stat }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { stat: initialStat } = Route.useLoaderData()
  const { tournId, league } = leagueRoute.useLoaderData()
  const { season } = leagueRoute.useSearch()

  const tabs = statsForFixtureType(league?.type)

  const [stat, setStat] = useState<StatId>(
    tabs.some((item) => item.id === initialStat)
      ? initialStat
      : (tabs[0]?.id ?? 'goals'),
  )

  if (!league || !season) return null

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Top stats"
      >
        {tabs.map((item) => {
          const active = item.id === stat
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStat(item.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 font-heading text-sm font-semibold transition-colors',
                active
                  ? 'bg-emerald-500/15 text-accent-foreground ring-1 ring-emerald-400/50'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      <Suspense
        key={stat}
        fallback={
          <div className="flex h-48 items-center justify-center font-heading text-sm text-muted-foreground">
            Loading...
          </div>
        }
      >
        <StatList tournId={tournId} season={season} stat={stat} />
      </Suspense>
    </div>
  )
}

function StatList({
  tournId,
  season,
  stat,
}: {
  tournId: string
  season: string
  stat: StatId
}) {
  const selected = stats.find((item) => item.id === stat) ?? stats[0]
  const { data: players } = useSuspenseQuery(selected.options(tournId, season))
  const columns =
    stat === 'cards'
      ? [
          {
            label: 'Yellow',
            className: 'text-amber-400',
            value: (player: TopPlayer) =>
              rugbyCardColumnTotals(player.sub_events).yellow,
          },
          {
            label: 'Red',
            className: 'text-red-400',
            value: (player: TopPlayer) =>
              rugbyCardColumnTotals(player.sub_events).red,
          },
        ]
      : undefined

  return (
    <TopPerformers
      players={players}
      eventName={selected.label}
      columns={columns}
    />
  )
}
