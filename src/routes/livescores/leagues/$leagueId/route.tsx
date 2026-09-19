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
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type LeagueSearch = {
  season?: string
}

function capitalize(value: string) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const Route = createFileRoute('/livescores/leagues/$leagueId')({
  validateSearch: (search: Record<string, unknown>): LeagueSearch => ({
    season: normalizeSeasonId(search.season),
  }),
  loaderDeps: ({ search: { season } }) => ({ season }),
  loader: ({ params, deps }) => {
    const { id, sport, league } = parseLeagueSlug(params.leagueId)
    const defaultSeason = league ? getDefaultSeasonId(league) : ''
    const seasonId = deps.season ?? defaultSeason
    const seasonEntry = league ? findSeasonEntry(league, seasonId) : undefined
    const seasonLabel = seasonEntry?.season?.trim() ?? ''

    return {
      league,
      tournId: id,
      sport,
      defaultSeason,
      seasonId,
      seasonLabel,
    }
  },
  head: ({ loaderData }) => {
    const leagueName = loaderData?.league?.name?.trim()
    const seasonLabel = loaderData?.seasonLabel?.trim()
    const sport = capitalize(loaderData?.sport ?? '')

    if (!leagueName) {
      return {
        meta: [
          { title: 'League | Tisini' },
          {
            name: 'description',
            content:
              'League results, standings and top scorers for African sport on Tisini.',
          },
        ],
      }
    }

    const title = seasonLabel
      ? `${leagueName} ${seasonLabel} | Tisini`
      : `${leagueName} | Tisini`

    const description = seasonLabel
      ? `Results, standings and top scorers for ${leagueName} (${seasonLabel})${
          sport ? ` — ${sport}` : ''
        } on Tisini.`
      : `Results, standings and top scorers for ${leagueName}${
          sport ? ` — ${sport}` : ''
        } on Tisini.`

    return {
      meta: [
        { title },
        { name: 'description', content: description },
      ],
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
  const activeLabel = league.series
    ? (findSeasonEntry(league, activeSeason)?.season ?? activeSeason)
    : (league.seasons.find((entry) => entry.id === activeSeason)?.season ??
      activeSeason)

  const selectSeason = (entry: (typeof league.seasons)[number]) => {
    const nextSeason = league.series
      ? (entry.series[0]?.id ?? '')
      : entry.id

    navigate({
      to: '.',
      search: { season: nextSeason },
    })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase sm:inline">
        Season
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 font-heading text-sm font-semibold text-foreground shadow-sm transition-colors',
            'hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40',
            'data-popup-open:border-emerald-400/50 data-popup-open:bg-emerald-500/10 data-popup-open:text-accent-foreground',
          )}
        >
          <span className="tabular-nums">{activeLabel}</span>
          <ChevronDownIcon className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Season</DropdownMenuLabel>
            {league.seasons.map((entry) => {
              const selected = entry.season === activeLabel
              return (
                <DropdownMenuItem
                  key={entry.id || entry.season}
                  onClick={() => selectSeason(entry)}
                  className={cn(
                    selected &&
                      'bg-emerald-500/15 text-accent-foreground focus:bg-emerald-500/20 focus:text-accent-foreground',
                  )}
                >
                  <span className="flex-1 tabular-nums">{entry.season}</span>
                  {selected ? (
                    <CheckIcon className="size-3.5 text-emerald-400" />
                  ) : null}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
