import {
  isInactiveMatchStatus,
  matchStatusLabel,
} from '#/lib/scores'
import type { FixtureDetails } from '#/lib/types'
import { cn, resolveMediaUrl } from '#/lib/utils'

const bar =
  'bg-[linear-gradient(180deg,#0a4a9e_0%,#023270_55%,#012456_100%)] shadow-[0_4px_16px_rgba(0,0,0,0.45)]'

const clockChip =
  'bg-[linear-gradient(180deg,#e8ecf1_0%,#c5ccd6_100%)] text-[#023270]'

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

function BugCrest({
  src,
  alt,
  fallbackSrc,
}: {
  src?: string | null
  alt: string
  fallbackSrc: string
}) {
  const resolved = resolveMediaUrl(src) || fallbackSrc

  return (
    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-black/10 sm:h-9 sm:w-9">
      <img
        src={resolved}
        alt={alt}
        referrerPolicy="no-referrer"
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain p-0.5"
      />
    </div>
  )
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

  const clockText = (() => {
    if (notStarted) return label || 'KO'
    if (inactive) return label || '—'
    return label || 'LIVE'
  })()

  return (
    <div
      className={cn(
        'flex w-fit max-w-[min(92vw,34rem)] items-stretch overflow-hidden rounded-md',
        bar,
        className,
      )}
    >
      {/* Clock / phase */}
      <div
        className={cn(
          'flex min-w-[3.25rem] shrink-0 items-center justify-center px-2.5 text-sm font-extrabold tracking-wide tabular-nums uppercase sm:min-w-[3.75rem] sm:text-base',
          clockChip,
        )}
      >
        {clockText}
      </div>

      {/* Home */}
      <div className="flex shrink-0 items-center gap-1.5 py-2 pl-2.5 pr-1.5 sm:gap-2 sm:pl-3">
        <BugCrest
          src={fixture.team1_logo}
          alt={fixture.team1_name}
          fallbackSrc="/homeLogo.png"
        />
        <span
          className="max-w-[4.5rem] truncate text-sm font-extrabold tracking-wide text-white uppercase sm:max-w-[5.5rem] sm:text-base"
          title={fixture.team1_name}
        >
          {homeAbbr}
        </span>
      </div>

      {/* Score */}
      <div className="flex shrink-0 items-center gap-1.5 px-1 font-heading text-xl font-bold tabular-nums text-white sm:gap-2 sm:text-2xl">
        {notStarted ? (
          <span className="px-1 text-base font-extrabold tracking-wide text-white/80 uppercase sm:text-lg">
            vs
          </span>
        ) : (
          <>
            <span className="min-w-[1.25rem] text-center">
              {fixture.home_score}
            </span>
            <span className="text-white/50">–</span>
            <span className="min-w-[1.25rem] text-center">
              {fixture.away_score}
            </span>
          </>
        )}
      </div>

      {/* Away */}
      <div className="flex shrink-0 items-center gap-1.5 py-2 pr-2.5 pl-1.5 sm:gap-2 sm:pr-3">
        <span
          className="max-w-[4.5rem] truncate text-right text-sm font-extrabold tracking-wide text-white uppercase sm:max-w-[5.5rem] sm:text-base"
          title={fixture.team2_name}
        >
          {awayAbbr}
        </span>
        <BugCrest
          src={fixture.team2_logo}
          alt={fixture.team2_name}
          fallbackSrc="/awayLogo.png"
        />
      </div>

      {/* Brand end-cap */}
      <div className="flex shrink-0 items-center border-l border-white/15 bg-white px-2 py-1.5 sm:px-2.5">
        <img
          src="/tisini-logo.png"
          alt="Tisini"
          width={120}
          height={40}
          className="h-7 w-auto object-contain sm:h-8"
        />
      </div>
    </div>
  )
}
