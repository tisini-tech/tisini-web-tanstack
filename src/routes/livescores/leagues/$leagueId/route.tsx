import {
  findSeasonEntry,
  getDefaultSeasonId,
  getSeriesForSeason,
  normalizeSeasonId,
  parseLeagueSlug,
} from '#/lib/leagues'
import {
  createFileRoute,
  Link,
  Navigate,
  Outlet,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router'
import { cn } from '@/lib/utils'

type LeagueSearch = {
  season?: string
}

export const Route = createFileRoute('/livescores/leagues/$leagueId')({
  validateSearch: (search: Record<string, unknown>): LeagueSearch => ({
    season: normalizeSeasonId(search.season),
  }),
  loader: ({ params }) => {
    const { id, sport, league } = parseLeagueSlug(params.leagueId)

    return {
      league,
      tournId: id,
      sport,
      defaultSeason: league ? getDefaultSeasonId(league) : '',
    }
  },
  component: RouteComponent,
})

const tabs = [
  {
    label: 'Results',
    to: '/livescores/leagues/$leagueId' as const,
    isActive: (pathname: string, leagueId: string) => {
      const base = `/livescores/leagues/${leagueId}`
      return pathname === base || pathname === `${base}/`
    },
  },
  {
    label: 'Top scorers',
    to: '/livescores/leagues/$leagueId/scorers' as const,
    isActive: (pathname: string) => pathname.endsWith('/scorers'),
  },
  {
    label: 'Standings',
    to: '/livescores/leagues/$leagueId/standings' as const,
    isActive: (pathname: string) => pathname.endsWith('/standings'),
  },
] as const

function RouteComponent() {
  const { leagueId } = Route.useParams()
  const { league, defaultSeason } = Route.useLoaderData()
  const { season: seasonFromSearch } = Route.useSearch()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (!league) {
    return (
      <div className="flex h-96 items-center justify-center font-heading text-xl text-muted-foreground">
        No fixture data yet!
      </div>
    )
  }

  const activeSeason = seasonFromSearch ?? defaultSeason
  const navigate = useNavigate()

  if (!seasonFromSearch && defaultSeason) {
    return (
      <Navigate
        to="/livescores/leagues/$leagueId"
        params={{ leagueId }}
        search={{ season: defaultSeason }}
        replace
      />
    )
  }

  const activeSeasonEntry = findSeasonEntry(league, activeSeason)
  const series = getSeriesForSeason(league, activeSeasonEntry)

  return (
    <div className="flex flex-col overflow-hidden rounded-xl">
      <header className="border-b border-border bg-card/60">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {league.name}
          </h1>

          {league.seasons.length > 1 ? (
            <SeasonSelect league={league} activeSeason={activeSeason} />
          ) : null}
        </div>

        {league.series && series.length > 0 ? (
          <div className="border-t border-border px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {series.map((item) => {
                const active = activeSeason === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      navigate({
                        to: '.',
                        search: { season: item.id },
                      })
                    }
                    className={cn(
                      'shrink-0 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                      active
                        ? 'bg-emerald-500/15 font-bold text-accent-foreground ring-1 ring-emerald-400/50'
                        : 'bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    {item.serie}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}

        <nav
          aria-label="League sections"
          className="flex border-t border-border"
        >
          {tabs.map((tab) => {
            const active = tab.isActive(pathname, leagueId)
            return (
              <Link
                key={tab.label}
                to={tab.to}
                params={{ leagueId }}
                search={{ season: activeSeason }}
                className={cn(
                  'flex-1 py-3 text-center font-heading text-sm font-semibold tracking-wide capitalize transition-colors sm:text-base',
                  active
                    ? 'border-b-2 border-emerald-400 bg-emerald-500/10 text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <section className="p-3 sm:p-4">
        <Outlet />
      </section>
    </div>
  )
}

type SeasonSelectProps = {
  league: NonNullable<ReturnType<typeof parseLeagueSlug>['league']>
  activeSeason: string
}

function SeasonSelect({ league, activeSeason }: SeasonSelectProps) {
  const navigate = useNavigate()

  return (
    <div className="relative">
      <select
        className="cursor-pointer appearance-none rounded-lg border border-border bg-muted/40 py-2 pr-9 pl-3 font-heading text-sm text-foreground focus:border-emerald-400/40 focus:outline-none"
        value={
          league.series
            ? findSeasonEntry(league, activeSeason)?.season
            : activeSeason
        }
        onChange={(event) => {
          const selected = league.seasons.find(
            (entry) =>
              entry.season === event.target.value ||
              entry.id === event.target.value,
          )
          if (!selected) return

          const nextSeason = league.series
            ? (selected.series[0]?.id ?? '')
            : selected.id

          navigate({
            to: '.',
            search: { season: nextSeason },
          })
        }}
      >
        {league.seasons.map((entry) => (
          <option key={entry.id || entry.season} value={entry.season}>
            {entry.season}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
        ▾
      </span>
    </div>
  )
}
