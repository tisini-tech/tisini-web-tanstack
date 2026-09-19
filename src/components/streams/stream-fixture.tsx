import { Link } from '@tanstack/react-router'

import type { Fixture } from '#/lib/types'
import {
  isInactiveMatchStatus,
  matchStatusClassName,
  matchStatusLabel,
} from '#/lib/scores'
import { cn } from '#/lib/utils'
import { TeamLogo } from '../scores/team-logo'

/** Fields shared by list fixtures and match-details fixture. */
export type StreamFixtureData = Pick<
  Fixture,
  | 'id'
  | 'team1_name'
  | 'team2_name'
  | 'team1_logo'
  | 'team2_logo'
  | 'home_score'
  | 'away_score'
  | 'game_status'
  | 'game_moment'
  | 'minute'
  | 'matchtime'
>

type StreamFixtureProps = {
  fixture: StreamFixtureData
  fixtureType: string
  /** Show Stats / Lower 3rd / etc. action row. */
  withActions?: boolean
  /** Wrap scoreboard in a link to the fixture detail page. */
  linkable?: boolean
}

function scoreValue(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const actionBase =
  'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-center text-xs font-semibold text-white transition-colors sm:text-sm'

const actions = {
  stats: 'bg-sky-600 hover:bg-sky-500',
  lowerThird: 'bg-emerald-600 hover:bg-emerald-500',
  insights: 'bg-amber-600 hover:bg-amber-500',
  history: 'bg-zinc-600 hover:bg-zinc-500',
  top: 'bg-violet-600 hover:bg-violet-500',
  homeLineup: 'bg-blue-700 hover:bg-blue-600',
  awayLineup: 'bg-orange-600 hover:bg-orange-500',
} as const

const scoreboardClass =
  'grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4 sm:gap-6 sm:px-5 sm:py-5'

export const StreamFixture = ({
  fixture,
  fixtureType,
  withActions = false,
  linkable = true,
}: StreamFixtureProps) => {
  const homeScore = scoreValue(fixture.home_score)
  const awayScore = scoreValue(fixture.away_score)
  const homeWin = homeScore > awayScore
  const awayWin = awayScore > homeScore
  const status = fixture.game_status
  const notStarted = status === 'notstarted'
  const inactive = isInactiveMatchStatus(status)
  const label = matchStatusLabel(fixture)
  const fixId = String(fixture.id)

  const scoreboard = (
    <>
      <div className="flex min-w-0 flex-col items-center gap-2 text-center">
        <TeamLogo
          src={fixture.team1_logo}
          alt={fixture.team1_name}
          fallbackSrc="/homeLogo.png"
          className="h-12 w-12 sm:h-14 sm:w-14"
        />
        <p className="line-clamp-2 font-heading text-sm font-semibold text-zinc-800 sm:text-base">
          {fixture.team1_name}
        </p>
      </div>

      <div className="flex min-w-[4.5rem] flex-col items-center justify-center">
        {notStarted ? (
          fixture.matchtime ? (
            <span className="font-mono text-sm text-zinc-600 sm:text-base">
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
              matchStatusClassName(status, label),
            )}
          >
            {label}
          </span>
        ) : (
          <>
            <div className="flex items-center font-heading text-2xl font-bold sm:text-3xl">
              <span className={homeWin ? 'text-zinc-900' : 'text-zinc-400'}>
                {fixture.home_score}
              </span>
              <span className="mx-2 text-zinc-400">–</span>
              <span className={awayWin ? 'text-zinc-900' : 'text-zinc-400'}>
                {fixture.away_score}
              </span>
            </div>
            {label ? (
              <span
                className={cn(
                  'mt-1 font-mono text-[10px] tracking-wide uppercase sm:text-xs',
                  matchStatusClassName(status, label),
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
          className="h-12 w-12 sm:h-14 sm:w-14"
        />
        <p className="line-clamp-2 font-heading text-sm font-semibold text-zinc-800 sm:text-base">
          {fixture.team2_name}
        </p>
      </div>
    </>
  )

  return (
    <article className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      {linkable ? (
        <Link
          to="/streams/$fixType/fixtures/$fixId"
          params={{ fixType: fixtureType, fixId }}
          className={cn(
            scoreboardClass,
            'cursor-pointer transition-colors duration-200 hover:bg-zinc-100',
          )}
        >
          {scoreboard}
        </Link>
      ) : (
        <div className={scoreboardClass}>{scoreboard}</div>
      )}

      {withActions ? (
        <div className="border-t border-zinc-200 bg-zinc-50 px-3 py-3 sm:px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/streams/$fixType/fixtures/$fixId/stats"
              params={{ fixType: fixtureType, fixId }}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(actionBase, actions.stats)}
            >
              Stats
            </Link>
            <Link
              to="/streams/$fixType/fixtures/$fixId/lower-third"
              params={{ fixType: fixtureType, fixId }}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(actionBase, actions.lowerThird)}
            >
              Lower 3rd
            </Link>
            {/* <Link
              to="/streams/$fixType/fixtures/$fixId/insights"
              params={{ fixType: fixtureType, fixId }}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(actionBase, actions.insights)}
            >
              Insights
            </Link>
            <Link
              to="/streams/$fixType/fixtures/$fixId/history"
              params={{ fixType: fixtureType, fixId }}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(actionBase, actions.history)}
            >
              History
            </Link>
            <Link
              to="/streams/$fixType/fixtures/$fixId/top-stats"
              params={{ fixType: fixtureType, fixId }}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(actionBase, actions.top)}
            >
              Top
            </Link> */}
            <Link
              to="/streams/$fixType/fixtures/$fixId/lineups"
              params={{ fixType: fixtureType, fixId }}
              search={{ isHome: true }}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(actionBase, actions.homeLineup)}
              title={`${fixture.team1_name} lineup`}
            >
              Home lineup
            </Link>
            <Link
              to="/streams/$fixType/fixtures/$fixId/lineups"
              params={{ fixType: fixtureType, fixId }}
              search={{ isHome: false }}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(actionBase, actions.awayLineup)}
              title={`${fixture.team2_name} lineup`}
            >
              Away lineup
            </Link>
          </div>
        </div>
      ) : null}
    </article>
  )
}
