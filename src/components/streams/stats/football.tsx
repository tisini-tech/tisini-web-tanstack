import { StatRow, StreamInsightsBy } from './stat-row'
import { getEvent, getSubEvent } from '#/lib/scores'
import type { FixtureEvent, FixtureStats } from '#/lib/types'

export const FootballStats = ({ data }: { data: FixtureStats }) => {
  const home = data?.home as FixtureEvent[]
  const away = data?.away as FixtureEvent[]

  const isChances =
    home.some((event) => event.event_id === 203) ||
    away.some((event) => event.event_id === 203)
  const isTouches =
    home.some((event) => event.event_id === 155) ||
    away.some((event) => event.event_id === 155)

  const hPasses = getEvent(home, '7')
  const aPasses = getEvent(away, '7')

  const hTotalPasses = getEvent(home, '25') + hPasses
  const aTotalPasses = getEvent(away, '25') + aPasses
  const totalPasses = hTotalPasses + aTotalPasses

  const hPossession = hTotalPasses
    ? Math.floor((hTotalPasses / totalPasses) * 100)
    : 0

  const homeYellow = getSubEvent(home, '5', '21')
  const awayYellow = getSubEvent(away, '5', '21')
  const homeRed = getSubEvent(home, '5', '22')
  const awayRed = getSubEvent(away, '5', '22')

  return (
    <div>
      <StatRow
        hStat={hPossession}
        title="Possession (%)"
        aStat={100 - hPossession}
      />

      <StatRow hStat={hPasses} title="Complete passes" aStat={aPasses} />

      <StatRow
        hStat={
          getSubEvent(home, '165', '422') +
          getSubEvent(home, '238', '606') +
          getSubEvent(home, '239', '610')
        }
        title="Attempt on target"
        aStat={
          getSubEvent(away, '165', '422') +
          getSubEvent(away, '238', '606') +
          getSubEvent(away, '239', '610')
        }
      />

      <StatRow
        hStat={
          getSubEvent(home, '165', '423') +
          getSubEvent(home, '238', '607') +
          getSubEvent(home, '239', '611')
        }
        title="Attempt off target"
        aStat={
          getSubEvent(away, '165', '423') +
          getSubEvent(away, '238', '607') +
          getSubEvent(away, '239', '611')
        }
      />

      {isChances ? (
        <StatRow
          hStat={getEvent(home, '203')}
          title="Chances created"
          aStat={getEvent(away, '203')}
        />
      ) : (
        <StatRow
          hStat={getEvent(home, '28')}
          title="Interceptions"
          aStat={getEvent(away, '28')}
        />
      )}

      {isTouches ? (
        <StatRow
          hStat={getEvent(home, '155')}
          title="Touches in opp box"
          aStat={getEvent(away, '155')}
        />
      ) : (
        <StatRow
          hStat={getEvent(home, '204')}
          title="Ball won back"
          aStat={getEvent(away, '204')}
        />
      )}

      <StatRow
        hStat={getEvent(home, '3')}
        title="Corner kicks"
        aStat={getEvent(away, '3')}
      />

      <StatRow
        hStat={getEvent(home, '10')}
        title="Offsides"
        aStat={getEvent(away, '10')}
      />

      <StatRow
        hStat={getSubEvent(home, '11', '74')}
        title="Fouls committed"
        aStat={getSubEvent(away, '11', '74')}
      />

      {(homeYellow >= 1 || awayYellow >= 1) && (
        <StatRow
          hStat={`${homeYellow}`}
          title="Yellow cards"
          aStat={`${awayYellow}`}
        />
      )}

      {(homeRed >= 1 || awayRed >= 1) && (
        <StatRow hStat={`${homeRed}`} title="Red cards" aStat={`${awayRed}`} />
      )}

      <StreamInsightsBy />
    </div>
  )
}
