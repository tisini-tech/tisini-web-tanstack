import { useSyncExternalStore } from 'react'

import type { FixtureLineup, FixtureLineups } from '#/lib/types'
import AwayPlayer from '@/components/scores/lineups/AwayPlayer'
import HomePlayer from '@/components/scores/lineups/HomePlayer'
import LineupsTitle from '@/components/scores/lineups/LineupsTitle'
import { cn } from '@/lib/utils'

type LineupsProps = {
  squads: FixtureLineups
}

/**
 * Formation slots — x = depth (goal → centre), y = across (touchline → touchline).
 * Landscape (desktop): left = x, top = y.
 * Portrait (mobile): remapped so home goal is top / away goal is bottom.
 */
type FormationSlot = { index: number; x: number; y: number }

const HOME_FORMATION: FormationSlot[] = [
  { index: 0, x: 12, y: 50 },
  { index: 1, x: 28, y: 12 },
  { index: 2, x: 28, y: 35 },
  { index: 3, x: 28, y: 65 },
  { index: 4, x: 28, y: 88 },
  { index: 6, x: 44, y: 35 },
  { index: 7, x: 44, y: 65 },
  { index: 5, x: 58, y: 18 },
  { index: 9, x: 58, y: 50 },
  { index: 8, x: 58, y: 82 },
  { index: 10, x: 74, y: 50 },
]

const AWAY_FORMATION: FormationSlot[] = [
  { index: 10, x: 26, y: 50 },
  { index: 8, x: 42, y: 18 },
  { index: 9, x: 42, y: 50 },
  { index: 5, x: 42, y: 82 },
  { index: 7, x: 56, y: 35 },
  { index: 6, x: 56, y: 65 },
  { index: 4, x: 72, y: 12 },
  { index: 3, x: 72, y: 35 },
  { index: 2, x: 72, y: 65 },
  { index: 1, x: 72, y: 88 },
  { index: 0, x: 88, y: 50 },
]

function getStarters(players: FixtureLineup[]) {
  const starters = players
    .filter((p) => p.player_type === 'first11')
    .sort((a, b) => a.lineupposition - b.lineupposition)

  if (starters.length >= 11) return starters.slice(0, 11)

  return players
    .filter((p) => p.player_type !== 'sub')
    .sort((a, b) => a.lineupposition - b.lineupposition)
    .slice(0, 11)
}

function subscribeMdUp(onChange: () => void) {
  const mq = window.matchMedia('(min-width: 768px)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function useIsMdUp() {
  return useSyncExternalStore(
    subscribeMdUp,
    () => window.matchMedia('(min-width: 768px)').matches,
    () => false,
  )
}

/** Map formation % into a padded band so jerseys/labels stay on the grass. */
function padPercent(value: number, inset = 6) {
  return inset + (value / 100) * (100 - inset * 2)
}

function slotPosition(
  side: 'home' | 'away',
  slot: FormationSlot,
  portrait: boolean,
): { left: string; top: string } {
  if (!portrait) {
    return {
      left: `${padPercent(slot.x, 4)}%`,
      top: `${padPercent(slot.y, 8)}%`,
    }
  }

  // Portrait stack: home goal at top, away goal at bottom.
  // Both halves use depth as top% — home GK is low x (top), away GK is high x (bottom).
  return {
    left: `${padPercent(slot.y, 8)}%`,
    top: `${padPercent(slot.x, 5)}%`,
  }
}

const FootballLineups = ({ squads }: LineupsProps) => {
  const homePlayers = squads?.home ?? []
  const awayPlayers = squads?.away ?? []
  const homeStarters = getStarters(homePlayers)
  const awayStarters = getStarters(awayPlayers)
  const isMdUp = useIsMdUp()
  const portrait = !isMdUp

  return (
    <div className="flex flex-col space-y-2 p-2">
      <div className="flex flex-col md:flex-row">
        <PitchHalf
          side="home"
          starters={homeStarters}
          formation={HOME_FORMATION}
          portrait={portrait}
        />
        <PitchHalf
          side="away"
          starters={awayStarters}
          formation={AWAY_FORMATION}
          portrait={portrait}
        />
      </div>

      <div>
        <LineupsTitle title="Substitutes" />

        <div className="flex justify-between gap-2 p-2">
          <div className="min-w-0 flex-1">
            {homePlayers.map((player) =>
              player.player_type === 'sub' ? (
                <HomePlayer
                  key={player.id}
                  name={player.pname}
                  jersey={player.jersey_no.toString()}
                />
              ) : null,
            )}
          </div>
          <div className="min-w-0 flex-1">
            {awayPlayers.map((player) =>
              player.player_type === 'sub' ? (
                <AwayPlayer
                  key={player.id}
                  name={player.pname}
                  jersey={player.jersey_no.toString()}
                />
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FootballLineups

type PitchHalfProps = {
  side: 'home' | 'away'
  starters: FixtureLineup[]
  formation: FormationSlot[]
  portrait: boolean
}

function PitchHalf({ side, starters, formation, portrait }: PitchHalfProps) {
  const hasLineup = starters.length > 1

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        // Mobile: tall portrait half. Desktop: side-by-side landscape half.
        portrait
          ? 'aspect-[3/4] w-full'
          : 'h-[400px] md:w-1/2',
        side === 'home'
          ? 'rounded-t-xl md:rounded-l-xl md:rounded-tr-none'
          : 'rounded-b-xl md:rounded-r-xl md:rounded-bl-none',
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 saturate-[0.7] contrast-[0.92] brightness-[0.88]',
          // Portrait assets on mobile; landscape ("-lg") on desktop (current working desktop).
          side === 'home'
            ? portrait
              ? "bg-[url('/home-pitch.png')]"
              : "bg-[url('/home-pitch-lg.png')]"
            : portrait
              ? "bg-[url('/away-pitch.png')]"
              : "bg-[url('/away-pitch-lg.png')]",
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 md:bg-gradient-to-r md:from-black/20 md:via-transparent md:to-black/30"
      />

      {hasLineup
        ? formation.map((slot) => {
            const player = starters[slot.index]
            if (!player) return null
            const pos = slotPosition(side, slot, portrait)
            return (
              <div
                key={`${side}-${slot.index}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={pos}
              >
                <PlayerTile player={player} compact={portrait} />
              </div>
            )
          })
        : null}

      {!hasLineup ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <p className="rounded-lg border border-border bg-card/80 px-4 py-2 font-heading text-sm font-semibold text-muted-foreground">
            Lineup not available
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function PlayerTile({
  player,
  compact = false,
}: {
  player?: FixtureLineup
  compact?: boolean
}) {
  if (!player) return null

  const nameParts = player.pname ? player.pname.trim().split(/\s+/).filter(Boolean) : []
  const displayName =
    nameParts.length > 1
      ? `${nameParts[0]![0]!.toUpperCase()}. ${nameParts[nameParts.length - 1]}`
      : (player.pname ?? '')

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        compact ? 'w-11 max-w-[2.75rem]' : 'w-14 sm:w-16',
      )}
    >
      <div className="relative shrink-0">
        <img
          src="/t-shirt.png"
          alt=""
          className={cn(
            'drop-shadow-md',
            compact ? 'h-7 w-7' : 'h-8 w-8 md:h-11 md:w-11',
          )}
        />
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center font-heading font-bold text-zinc-900',
            compact ? 'text-[9px]' : 'text-[10px] md:text-xs',
          )}
        >
          {player.jersey_no}
        </div>
      </div>
      <p
        className={cn(
          'mt-0.5 w-full truncate text-center font-semibold capitalize text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]',
          compact ? 'text-[8px] leading-tight' : 'text-[10px] md:text-xs',
        )}
        title={player.pname}
      >
        {displayName}
      </p>
    </div>
  )
}
