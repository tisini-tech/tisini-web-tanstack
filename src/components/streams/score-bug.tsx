import { useEffect, useState } from 'react'

import {
  isInactiveMatchStatus,
  matchStatusLabel,
  runningMatchClock,
} from '#/lib/scores'
import type { FixtureDetails } from '#/lib/types'
import { cn, resolveMediaUrl } from '#/lib/utils'

function teamAbbr(shortName: string | undefined, fullName: string) {
  const short = shortName?.trim()
  if (short) return short.toUpperCase()

  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return parts
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 4)
      .toUpperCase()
  }

  return fullName.trim().slice(0, 3).toUpperCase() || '—'
}

type ScoreBugProps = {
  fixture: FixtureDetails['fixture']
  className?: string
}

export function ScoreBug({ fixture, className }: ScoreBugProps) {
  const status = fixture.game_status
  const notStarted = status === 'notstarted'
  const inactive = isInactiveMatchStatus(status)
  const label = matchStatusLabel(fixture)
  const homeAbbr = teamAbbr(fixture.team1_short_name, fixture.team1_name)
  const awayAbbr = teamAbbr(fixture.team2_short_name, fixture.team2_name)

  const clockActive =
    fixture.game_status === 'started' &&
    Boolean(fixture.started_at || fixture.started_second_half_at)
  const now = useMatchClockNow(clockActive)
  const running = runningMatchClock(fixture, now)

  const clockText =
    running ??
    (notStarted ? label || 'KO' : inactive ? label || '—' : label || 'LIVE')

  const leagueLogo = resolveMediaUrl(fixture.league_logo)
  const hasLeagueLogo = Boolean(leagueLogo)

  const leagueName = fixture.league_name || 'League'

  const homeScore = notStarted ? '–' : fixture.home_score
  const awayScore = notStarted ? '–' : fixture.away_score

  return (
    <div
      className={cn(
        'flex w-fit flex-col drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]',
        className,
      )}
    >
      <div className="grid grid-cols-[6.5rem_minmax(8.5rem,1fr)_auto]">
        {hasLeagueLogo ? (
          <div className="relative row-span-2 rounded-tl-md border-t-4 border-l-4 border-[#2a2a2a] bg-[#c8ccd0]">
            <img
              src={leagueLogo}
              alt={leagueName}
              referrerPolicy="no-referrer"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        ) : null}

        <TeamName
          abbr={homeAbbr}
          name={fixture.team1_name}
          logo={fixture.team1_logo}
          fallbackLogo="/homeLogo.png"
          tone="home"
          className={
            hasLeagueLogo
              ? 'border-t-4 border-[#2a2a2a]'
              : 'col-span-2 rounded-tl-md border-t-4 border-l-4 border-[#2a2a2a]'
          }
        />
        <ScoreCell
          value={homeScore}
          className="rounded-tr-md border-t-4 border-r-4 border-b-2 border-[#2a2a2a]"
        />

        <TeamName
          abbr={awayAbbr}
          name={fixture.team2_name}
          logo={fixture.team2_logo}
          fallbackLogo="/awayLogo.png"
          tone="away"
          className={hasLeagueLogo ? undefined : 'col-span-2 border-l-4 border-[#2a2a2a]'}
        />
        <ScoreCell
          value={awayScore}
          className="border-r-4 border-[#2a2a2a]"
        />

        <div className="flex items-center justify-center rounded-bl-md border-b-4 border-l-4 border-[#2a2a2a] bg-[#2f6fad] px-1 py-1">
          <img
            src="/tisini-logo.png"
            alt="Tisini"
            width={120}
            height={40}
            className="h-7 w-full object-contain"
          />
        </div>
        <div className="col-span-2 flex items-center justify-center rounded-br-md border-r-4 border-b-4 border-[#2a2a2a] bg-[#023270] px-3 text-base font-extrabold tracking-wide text-white tabular-nums uppercase">
          {clockText}
        </div>
      </div>
    </div>
  )
}

function useMatchClockNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [active])

  return now
}

function TeamName({
  abbr,
  name,
  logo,
  fallbackLogo,
  tone,
  className,
}: {
  abbr: string
  name: string
  logo?: string | null
  fallbackLogo: string
  tone: 'home' | 'away'
  className?: string
}) {
  const crest = resolveMediaUrl(logo) || fallbackLogo
  const away = tone === 'away'

  return (
    <span
      className={cn(
        'flex min-h-12 items-center gap-2 px-2',
        away ? 'bg-[#f5c518]' : 'bg-[#0c7a34]',
        className,
      )}
      title={name}
    >
      <img
        src={crest}
        alt=""
        referrerPolicy="no-referrer"
        decoding="async"
        className="h-7 w-8 shrink-0 object-contain"
      />
      <span
        className={cn(
          'text-lg font-extrabold tracking-wide uppercase',
          away ? 'text-[#1a1400]' : 'text-white',
        )}
      >
        {abbr}
      </span>
    </span>
  )
}

function ScoreCell({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        'flex min-w-12 items-center justify-center bg-white px-2 font-heading text-3xl font-bold text-[#111] tabular-nums',
        className,
      )}
    >
      {value}
    </span>
  )
}
