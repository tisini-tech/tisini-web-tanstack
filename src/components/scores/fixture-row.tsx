import { Link } from '@tanstack/react-router'
import type { Fixture } from '#/lib/types'
import {
  isInactiveMatchStatus,
  matchStatusClassName,
  matchStatusLabel,
} from '#/lib/scores'
import { cn } from '#/lib/utils'
import { TeamLogo } from './team-logo'

type FixtureRowProps = {
  fixture: Fixture
}

function scoreValue(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function FixtureRow({ fixture }: FixtureRowProps) {
  const homeScore = scoreValue(fixture.home_score)
  const awayScore = scoreValue(fixture.away_score)
  const homeWin = homeScore > awayScore
  const awayWin = awayScore > homeScore
  const status = fixture.game_status
  const notStarted = status === 'notstarted'
  const inactive = isInactiveMatchStatus(status)
  const label = matchStatusLabel(fixture)

  return (
    <Link
      to="/livescores/$fixtureType/$fixtureId"
      params={{
        fixtureType: fixture.fixture_type,
        fixtureId: String(fixture.id),
      }}
      className="block w-full border-b border-border px-2 py-3 transition-colors hover:bg-muted/40"
    >
      <div className="grid grid-cols-12 items-center gap-2 text-sm font-semibold">
        <div className="col-span-5 flex flex-row-reverse items-center gap-2 lg:flex-col lg:justify-center">
          <TeamLogo
            src={fixture.team1_logo}
            alt={fixture.team1_name}
            fallbackSrc="/homeLogo.png"
          />
          <div className="min-w-0 flex-1 text-right text-foreground/90 lg:text-center">
            {fixture.team1_name}
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-center">
          {notStarted ? (
            fixture.matchtime === '' ? (
              <span className="animate-pulse text-lg" aria-hidden="true">
                ⌛
              </span>
            ) : (
              <span className="font-mono text-xs text-muted-foreground">
                {fixture.matchtime}
              </span>
            )
          ) : inactive ? (
            <span
              className={cn(
                'text-center font-mono text-[10px] tracking-wide uppercase sm:text-xs',
                matchStatusClassName(status),
              )}
            >
              {label}
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center font-heading text-base font-bold lg:text-2xl">
                <span
                  className={
                    homeWin ? 'text-foreground' : 'text-muted-foreground'
                  }
                >
                  {fixture.home_score}
                </span>
                <span className="mx-1.5 text-muted-foreground md:mx-2">–</span>
                <span
                  className={
                    awayWin ? 'text-foreground' : 'text-muted-foreground'
                  }
                >
                  {fixture.away_score}
                </span>
              </div>
              {label ? (
                <span
                  className={cn(
                    'font-mono text-[10px] tracking-wide uppercase',
                    matchStatusClassName(status),
                  )}
                >
                  {label}
                </span>
              ) : null}
            </div>
          )}
        </div>

        <div className="col-span-5 flex items-center gap-2 lg:flex-col lg:justify-center">
          <TeamLogo
            src={fixture.team2_logo}
            alt={fixture.team2_name}
            fallbackSrc="/awayLogo.png"
          />
          <div className="min-w-0 flex-1 text-foreground/90 lg:text-center">
            {fixture.team2_name}
          </div>
        </div>
      </div>
    </Link>
  )
}
