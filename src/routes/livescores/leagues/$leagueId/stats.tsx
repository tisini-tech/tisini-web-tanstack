import { Suspense, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, getRouteApi } from '@tanstack/react-router'

import { cn } from '@/lib/utils'
import { normalizeSeasonId, parseLeagueSlug } from '#/lib/leagues'
import { TopPerformers } from '#/components/scores/top-performers'
import {
  getSeasonCleanSheetsQueryOptions,
  seasonTopAssistsQueryOptions,
  seasonTopscorersQueryOptions,
} from '#/data/scores'

const leagueRoute = getRouteApi('/livescores/leagues/$leagueId')

const stats = [
  {
    id: 'goals',
    label: 'Goals',
    options: seasonTopscorersQueryOptions,
  },
  {
    id: 'assists',
    label: 'Assists',
    options: seasonTopAssistsQueryOptions,
  },
  {
    id: 'cleansheets',
    label: 'Clean sheets',
    options: getSeasonCleanSheetsQueryOptions,
  },
] as const

type StatId = (typeof stats)[number]['id']

function isStatId(value: string): value is StatId {
  return stats.some((stat) => stat.id === value)
}

export const Route = createFileRoute('/livescores/leagues/$leagueId/stats')({
  loader: async ({ params, context, location }) => {
    const stat = stats[Math.floor(Math.random() * stats.length)]!.id
    const { id } = parseLeagueSlug(params.leagueId)
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
  const [stat, setStat] = useState<StatId>(
    isStatId(initialStat) ? initialStat : 'goals',
  )

  if (!league || !season) return null

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Top stats"
      >
        {stats.map((item) => {
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

  return <TopPerformers players={players} eventName={selected.label} />
}
