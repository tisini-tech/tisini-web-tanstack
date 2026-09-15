import { getFixtureDetails, getFixtureLineups } from '#/data/scores'
import {
  isInactiveMatchStatus,
  matchStatusClassName,
  matchStatusLabel,
} from '#/lib/scores'
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { TeamLogo } from '@/components/scores/team-logo'
import { cn, formatDate } from '@/lib/utils'

export const Route = createFileRoute('/livescores/$fixtureType/$fixtureId')({
  loader: async ({ params }) => {
    const fixtureDetails = await getFixtureDetails({
      data: { fixtureId: String(params.fixtureId) },
    })

    const fixtureLineups = await getFixtureLineups({
      data: { fixtureId: String(params.fixtureId) },
    })

    return { fixtureDetails, fixtureLineups }
  },
  head: ({ loaderData }) => {
    const fixture = loaderData?.fixtureDetails?.fixture
    if (!fixture) {
      return {
        meta: [
          { title: 'Match | Tisini' },
          {
            name: 'description',
            content: 'Live scores, stats and lineups on Tisini.',
          },
        ],
      }
    }

    const home = fixture.team1_name.trim()
    const away = fixture.team2_name.trim()
    const league = fixture.league?.trim()
    const date = formatDate(fixture.game_date.split(' ')[0] || fixture.game_date)
    const notStarted = fixture.game_status === 'notstarted'
    const inactive = isInactiveMatchStatus(fixture.game_status)

    const matchTitle =
      notStarted || inactive
        ? `${home} vs ${away}`
        : `${home} ${fixture.home_score}–${fixture.away_score} ${away}`

    const title = [matchTitle, league, 'Tisini'].filter(Boolean).join(' | ')

    let description = notStarted
      ? `${home} vs ${away}${date ? ` on ${date}` : ''}${
          fixture.matchtime ? ` at ${fixture.matchtime}` : ''
        }`
      : `${home} ${fixture.home_score}–${fixture.away_score} ${away}${
          date ? ` on ${date}` : ''
        }`

    if (league) description += ` in ${league}`
    description += '. Live score, stats and lineups on Tisini.'

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
    label: 'Details',
    to: '/livescores/$fixtureType/$fixtureId/overview' as const,
    isActive: (pathname: string) => pathname.endsWith('/overview'),
  },
  {
    label: 'Stats',
    to: '/livescores/$fixtureType/$fixtureId' as const,
    isActive: (pathname: string, fixtureType: string, fixtureId: string) => {
      const base = `/livescores/${fixtureType}/${fixtureId}`
      return pathname === base || pathname === `${base}/`
    },
  },
  {
    label: 'Line ups',
    to: '/livescores/$fixtureType/$fixtureId/lineups' as const,
    isActive: (pathname: string) => pathname.endsWith('/lineups'),
  },
] as const

function scoreValue(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function RouteComponent() {
  const { fixtureType, fixtureId } = Route.useParams()
  const { fixtureDetails } = Route.useLoaderData()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const fixture = fixtureDetails.fixture
  const homeScore = scoreValue(fixture.home_score)
  const awayScore = scoreValue(fixture.away_score)
  const homeWin = homeScore > awayScore
  const awayWin = awayScore > homeScore
  const status = fixture.game_status
  const notStarted = status === 'notstarted'
  const inactive = isInactiveMatchStatus(status)
  const label = matchStatusLabel(fixture)

  const matchdayLabel =
    fixture.fixture_type === 'football' || fixture.fixture_type === 'basketball'
      ? `Round: ${fixture.matchday}`
      : fixture.matchday

  const matchDate = fixture.game_date.split(' ')[0]

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-t-xl border border-border bg-card/40">
        {/* Meta bar */}
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2 sm:px-4">
          <span className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] tracking-wide text-accent-foreground uppercase sm:text-xs">
            {matchdayLabel}
          </span>
          <span className="truncate px-2 text-center font-heading text-xs font-semibold text-foreground/90 capitalize sm:text-sm">
            {fixture.league}
          </span>
          <span className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] tracking-wide text-muted-foreground sm:text-xs">
            {matchDate}
          </span>
        </div>

        {/* Teams + score */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-6 sm:gap-6 sm:py-8">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <TeamLogo
              src={fixture.team1_logo}
              alt={fixture.team1_name}
              fallbackSrc="/homeLogo.png"
              className="h-14 w-14 sm:h-16 sm:w-16"
            />
            <p className="font-heading text-sm font-semibold leading-snug text-foreground sm:text-base">
              {fixture.team1_name}
            </p>
          </div>

          <div className="flex min-w-[5.5rem] flex-col items-center justify-center">
            {notStarted ? (
              fixture.matchtime ? (
                <span className="font-mono text-sm text-muted-foreground sm:text-base">
                  {fixture.matchtime}
                </span>
              ) : (
                <span className="animate-pulse text-2xl" aria-hidden="true">
                  ⌛
                </span>
              )
            ) : inactive ? (
              <span
                className={cn(
                  'text-center font-mono text-xs tracking-wide uppercase sm:text-sm',
                  matchStatusClassName(status),
                )}
              >
                {label}
              </span>
            ) : (
              <>
                <div className="flex items-center font-heading text-2xl font-bold sm:text-3xl">
                  <span
                    className={cn(
                      homeWin ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {fixture.home_score}
                  </span>
                  <span className="mx-2 text-muted-foreground">–</span>
                  <span
                    className={cn(
                      awayWin ? 'text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {fixture.away_score}
                  </span>
                </div>
                {label ? (
                  <span
                    className={cn(
                      'mt-1 font-mono text-[10px] tracking-wide uppercase',
                      matchStatusClassName(status),
                    )}
                  >
                    {label}
                  </span>
                ) : null}
              </>
            )}
          </div>

          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <TeamLogo
              src={fixture.team2_logo}
              alt={fixture.team2_name}
              fallbackSrc="/awayLogo.png"
              className="h-14 w-14 sm:h-16 sm:w-16"
            />
            <p className="font-heading text-sm font-semibold leading-snug text-foreground sm:text-base">
              {fixture.team2_name}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav
        aria-label="Match sections"
        className="flex gap-1 overflow-x-auto border border-t-0 border-border bg-muted/30 p-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => {
          const active = tab.isActive(pathname, fixtureType, fixtureId)
          return (
            <Link
              key={tab.label}
              to={tab.to}
              params={{ fixtureType, fixtureId }}
              className={cn(
                'flex-1 rounded-lg px-3 py-2.5 text-center font-heading text-xs font-semibold tracking-wide transition-colors sm:px-4 sm:py-3 sm:text-sm',
                active
                  ? 'bg-emerald-500/15 text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className="rounded-b-xl border border-t-0 border-border bg-card/20 p-4 sm:p-5">
        <Outlet />
      </div>
    </div>
  )
}
