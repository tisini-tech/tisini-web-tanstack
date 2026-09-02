import type { FixtureLineups } from '#/lib/types'
import AwayPlayer from '@/components/scores/lineups/AwayPlayer'
import HomePlayer from '@/components/scores/lineups/HomePlayer'
import LineupsTitle from '@/components/scores/lineups/LineupsTitle'

type LineUpsProps = {
  squads: FixtureLineups
}

const RugbyLineups = ({ squads }: LineUpsProps) => {
  const homePlayers = squads?.home ?? []
  const awayPlayers = squads?.away ?? []

  return (
    <div className="flex flex-col space-y-2 p-2">
      <LineupsTitle title="Starting Players" />

      <div className="flex justify-between p-2">
        <div>
          {homePlayers.map((player) =>
            player.player_type === 'first11' ? (
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
            player.player_type === 'first11' ? (
              <AwayPlayer
                key={player.id}
                name={player.pname}
                jersey={player.jersey_no.toString()}
              />
            ) : null,
          )}
        </div>
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

export default RugbyLineups
