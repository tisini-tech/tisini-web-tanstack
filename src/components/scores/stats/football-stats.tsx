import type { FixtureEvent } from '#/lib/types'
import { calcBallPosession, getEvent, getSubEvent } from '@/lib/scores'

import PosessionRow from '../charts/PosessionRow'
import AccuracyRow from '../charts/AccuracyRow'
import StatsRow from '../StatsRow'
import StatsHalf from '../StatsHalf'

type StatsProps = {
  home: FixtureEvent[]
  away: FixtureEvent[]
}

const FootballStats = ({ home, away }: StatsProps) => {
  const posession = calcBallPosession(home, away)

  const homePass = getEvent(home, '7')
  const awayPass = getEvent(away, '7')

  const homeOnly = awayPass <= 0
  const awayOnly = homePass <= 0
  const bothTeams = awayPass > 0 && homePass > 0

  const homePasses = getEvent(home, '7') + getEvent(home, '25')
  const awayPasses = getEvent(away, '7') + getEvent(away, '25')

  const homeTarget =
    getSubEvent(home, '165', '422') +
    getSubEvent(home, '156', '405') +
    getSubEvent(home, '238', '606') +
    getSubEvent(home, '238', '610')
  const awayTarget =
    getSubEvent(away, '156', '405') +
    getSubEvent(away, '165', '422') +
    getSubEvent(away, '238', '606') +
    getSubEvent(away, '238', '610')

  return (
    <div className="flex flex-col space-y-4 ">
      <StatsHalf />

      {bothTeams && (
        <PosessionRow
          homeStat={`${posession.home}`}
          stat={'Possession'}
          awayStat={`${posession.away}`}
        />
      )}

      <AccuracyRow
        hComp={homeTarget}
        aComp={awayTarget}
        hTotal={
          getEvent(home, '165') + getEvent(home, '156') + getEvent(home, '238')
        }
        aTotal={
          getEvent(away, '165') + getEvent(away, '156') + getEvent(away, '238')
        }
        stat={'Attempts on Target'}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <AccuracyRow
        hComp={getEvent(home, '7')}
        aComp={getEvent(away, '7')}
        hTotal={homePasses}
        aTotal={awayPasses}
        stat={'Complete passes'}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getEvent(home, '3')}
        stat={'Corner kicks'}
        awayStat={getEvent(away, '3')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getEvent(home, '10')}
        stat={'Offsides'}
        awayStat={getEvent(away, '10')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getSubEvent(home, '11', '74')}
        stat={'Fouls'}
        awayStat={getSubEvent(away, '11', '74')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getSubEvent(home, '5', '21')}
        stat={'Yellow cards'}
        awayStat={getSubEvent(away, '5', '21')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getSubEvent(home, '5', '22')}
        stat={'Red cards'}
        awayStat={getSubEvent(away, '5', '22')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />
    </div>
  )
}

export default FootballStats
