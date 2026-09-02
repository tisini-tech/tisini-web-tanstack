import type { FixtureLineup, FixtureLineups } from '#/lib/types'
import AwayPlayer from '@/components/scores/lineups/AwayPlayer'
import HomePlayer from '@/components/scores/lineups/HomePlayer'
import LineupsTitle from '@/components/scores/lineups/LineupsTitle'
import { cn } from '@/lib/utils'

type LineupsProps = {
  squads: FixtureLineups
}

/** 1-4-3-1 slot indices — x/y are % within each half-pitch (goal → centre). */
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

const FootballLineups = ({ squads }: LineupsProps) => {
  const homePlayers = squads?.home ?? []
  const awayPlayers = squads?.away ?? []
  const homeStarters = getStarters(homePlayers)
  const awayStarters = getStarters(awayPlayers)

  return (
    <div className="flex flex-col space-y-2 p-2">
      <div className="flex flex-col md:flex-row">
        <PitchHalf
          side="home"
          starters={homeStarters}
          formation={HOME_FORMATION}
        />
        <PitchHalf
          side="away"
          starters={awayStarters}
          formation={AWAY_FORMATION}
        />
      </div>

      <div>
        <LineupsTitle title="Substitutes" />

        <div className="flex justify-between p-2">
          <div>
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
          <div>
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
}

function PitchHalf({ side, starters, formation }: PitchHalfProps) {
  const hasLineup = starters.length > 1

  return (
    <div
      className={cn(
        'relative h-[320px] w-full overflow-hidden md:h-[400px] md:w-1/2',
        side === 'home' ? 'rounded-t-xl md:rounded-l-xl md:rounded-tr-none' : 'rounded-b-xl md:rounded-r-xl md:rounded-bl-none',
      )}
    >
      {/* Pitch art — muted so it doesn’t overpower the UI */}
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 saturate-[0.7] contrast-[0.92] brightness-[0.88]',
          side === 'home'
            ? "bg-[url('/home-pitch.png')] md:bg-[url('/home-pitch-lg.png')]"
            : "bg-[url('/away-pitch.png')] md:bg-[url('/away-pitch-lg.png')]",
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35"
      />

      {hasLineup
        ? formation.map((slot) => {
            const player = starters[slot.index]
            if (!player) return null
            return (
              <div
                key={`${side}-${slot.index}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              >
                <PlayerTile player={player} />
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

export function PlayerTile({ player }: { player?: FixtureLineup }) {
  if (!player) return null

  const nameParts = player.pname ? player.pname.split(' ') : []
  const displayName =
    nameParts.length > 1
      ? nameParts[1] === ''
        ? `${nameParts[0]?.[0] ?? ''}. ${nameParts[2] ?? ''}`
        : `${nameParts[0]?.[0] ?? ''}. ${nameParts[1]}`
      : player.pname

  return (
    <div className="flex w-14 flex-col items-center sm:w-16">
      <div className="relative shrink-0">
        <img
          src="/t-shirt.png"
          alt=""
          className="h-8 w-8 drop-shadow-md md:h-11 md:w-11"
        />
        {/* White jersey → force dark number for contrast */}
        <div className="absolute inset-0 flex items-center justify-center font-heading text-[10px] font-bold text-zinc-900 md:text-xs">
          {player.jersey_no}
        </div>
      </div>
      <p className="mt-0.5 w-full truncate text-center text-[10px] font-semibold capitalize text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] md:text-xs">
        {displayName}
      </p>
    </div>
  )
}
