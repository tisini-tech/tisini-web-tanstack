import { getEvent } from '@/lib/scores'
import type { FixtureEvent } from '#/lib/types'
import StatsHalf from '../StatsHalf'
import StatsRow from '../StatsRow'

type StatsProps = {
  home: FixtureEvent[]
  away: FixtureEvent[]
}

const BasketballStats = ({ home, away }: StatsProps) => {
  const homePass = getEvent(home, '182')
  const awayPass = getEvent(away, '182')

  const homeOnly = awayPass <= 0
  const awayOnly = homePass <= 0
  const bothTeams = awayPass > 0 && homePass > 0

  return (
    <div className="flex flex-col space-y-6 ">
      <StatsHalf />

      <StatsRow
        homeStat={getEvent(home, '172')}
        stat={'Assists'}
        awayStat={getEvent(away, '172')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getEvent(home, '174')}
        stat={'Rebounds'}
        awayStat={getEvent(away, '174')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getEvent(home, '171')}
        stat={'Blocks'}
        awayStat={getEvent(away, '171')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getEvent(home, '176')}
        stat={'Turnovers'}
        awayStat={getEvent(away, '176')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getEvent(home, '173')}
        stat={'Steals'}
        awayStat={getEvent(away, '173')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />

      <StatsRow
        homeStat={getEvent(home, '177')}
        stat={'Fouls'}
        awayStat={getEvent(away, '177')}
        homeOnly={homeOnly}
        awayOnly={awayOnly}
        bothTeams={bothTeams}
      />
    </div>
  )
}

export default BasketballStats
