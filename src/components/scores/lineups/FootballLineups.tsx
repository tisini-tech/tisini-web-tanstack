import { useSyncExternalStore } from 'react'

import { cn } from '@/lib/utils'
import AwayPlayer from '@/components/scores/lineups/AwayPlayer'
import type { FixtureLineup, FixtureLineups } from '#/lib/types'
import LineupsTitle from '@/components/scores/lineups/LineupsTitle'
import HomePlayer, { SubMark } from '@/components/scores/lineups/HomePlayer'
import {
  allFormationPositions,
  buildFormationBands,
  footballFormationOrDefault,
  getStartersByPosition,
  placeFormationOnHalf,
  type HalfPitchSlot,
} from '#/lib/formation'
import {
  substitutionForPlayer,
  type SubAppearance,
  type SubIndex,
} from '#/lib/substitutions'

type LineupsProps = {
  squads: FixtureLineups
  homeSubs?: SubIndex
  awaySubs?: SubIndex
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

const FootballLineups = ({ squads, homeSubs, awaySubs }: LineupsProps) => {
  const homePlayers = squads?.home ?? []
  const awayPlayers = squads?.away ?? []
  const isMdUp = useIsMdUp()
  const portrait = !isMdUp
  const homeFormation = footballFormationOrDefault(squads?.home_formation)
  const awayFormation = footballFormationOrDefault(squads?.away_formation)

  return (
    <div className="flex flex-col space-y-2 p-2">
      <div className="flex flex-col md:flex-row">
        <PitchHalf
          side="home"
          players={homePlayers}
          formation={homeFormation}
          portrait={portrait}
          subs={homeSubs}
        />
        <PitchHalf
          side="away"
          players={awayPlayers}
          formation={awayFormation}
          portrait={portrait}
          subs={awaySubs}
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
                  substitution={substitutionForPlayer(homeSubs, player)}
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
                  substitution={substitutionForPlayer(awaySubs, player)}
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
  players: FixtureLineup[]
  formation: ReturnType<typeof footballFormationOrDefault>
  portrait: boolean
  subs?: SubIndex
}

function PitchHalf({
  side,
  players,
  formation,
  portrait,
  subs,
}: PitchHalfProps) {
  const slots: HalfPitchSlot[] = placeFormationOnHalf(formation, side, portrait)
  const bySlot = getStartersByPosition(
    players,
    allFormationPositions(buildFormationBands(formation)),
  )
  const hasLineup = bySlot.size > 1

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        // Mobile: tall portrait half. Desktop: side-by-side landscape half.
        portrait ? 'aspect-[3/4] w-full' : 'h-[400px] md:w-1/2',
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
        ? slots.map((slot) => {
            const player = bySlot.get(slot.slot)
            if (!player) return null
            return (
              <div
                key={`${side}-${slot.slot}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: slot.left, top: slot.top }}
              >
                <PlayerTile
                  player={player}
                  compact={portrait}
                  side={side}
                  substitution={substitutionForPlayer(subs, player)}
                />
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

const jerseyTone = {
  home: {
    shirt: 'bg-white',
    number: 'text-zinc-900',
  },
  away: {
    shirt: 'bg-sky-500',
    number: 'text-white',
  },
} as const

export function PlayerTile({
  player,
  compact = false,
  substitution,
  side = 'home',
}: {
  player?: FixtureLineup
  compact?: boolean
  substitution?: SubAppearance | null
  side?: 'home' | 'away'
}) {
  if (!player) return null

  const tone = jerseyTone[side]
  const nameParts = player.pname
    ? player.pname.trim().split(/\s+/).filter(Boolean)
    : []
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
        <div
          aria-hidden
          className={cn(
            'drop-shadow-md [mask-image:url(/t-shirt.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-image:url(/t-shirt.png)] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]',
            tone.shirt,
            compact ? 'h-7 w-7' : 'h-8 w-8 md:h-11 md:w-11',
          )}
        />
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center font-heading font-bold',
            tone.number,
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
      {substitution ? <SubMark substitution={substitution} onPitch /> : null}
    </div>
  )
}
