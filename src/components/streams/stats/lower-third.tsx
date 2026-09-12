import { getEvent, getSubEvent } from '#/lib/scores'
import type { FixtureEvent, FixtureStats } from '#/lib/types'

export const rugbyLowerThirdStats = (data: FixtureStats) => {
  if (!data?.home || !data?.away) return []

  const home = data.home as FixtureEvent[]
  const away = data.away as FixtureEvent[]

  const homeYellow =
    getSubEvent(home, '120', '46') +
    getSubEvent(home, '66', '54') +
    getSubEvent(home, '55', '544') +
    getSubEvent(home, '260', '694')
  const awayYellow =
    getSubEvent(away, '120', '46') +
    getSubEvent(away, '66', '54') +
    getSubEvent(away, '55', '544') +
    getSubEvent(away, '260', '694')
  const homeRed =
    getSubEvent(home, '120', '45') +
    getSubEvent(home, '66', '55') +
    getSubEvent(home, '55', '545') +
    getSubEvent(home, '260', '693')
  const awayRed =
    getSubEvent(away, '120', '45') +
    getSubEvent(away, '66', '55') +
    getSubEvent(away, '55', '545') +
    getSubEvent(away, '260', '693')

  const hLineWon =
    getSubEvent(home, '151', '377') +
    getSubEvent(home, '151', '378') +
    getSubEvent(home, '151', '379') +
    getSubEvent(home, '151', '391') +
    getSubEvent(home, '150', '371') +
    getSubEvent(home, '150', '372') +
    getSubEvent(home, '150', '373') +
    getSubEvent(home, '150', '389') +
    getSubEvent(home, '152', '383') +
    getSubEvent(home, '152', '384') +
    getSubEvent(home, '152', '385') +
    getSubEvent(home, '152', '393') +
    getSubEvent(home, '263', '705') +
    getSubEvent(home, '263', '706') +
    getSubEvent(home, '263', '707') +
    getSubEvent(home, '263', '711')
  const hLineThrown =
    getEvent(home, '151') +
    getEvent(home, '150') +
    getEvent(home, '152') +
    getEvent(home, '263')

  const aLineWon =
    getSubEvent(away, '151', '377') +
    getSubEvent(away, '151', '378') +
    getSubEvent(away, '151', '379') +
    getSubEvent(away, '151', '391') +
    getSubEvent(away, '150', '371') +
    getSubEvent(away, '150', '372') +
    getSubEvent(away, '150', '373') +
    getSubEvent(away, '150', '389') +
    getSubEvent(away, '152', '383') +
    getSubEvent(away, '152', '384') +
    getSubEvent(away, '152', '385') +
    getSubEvent(away, '152', '393') +
    getSubEvent(away, '263', '705') +
    getSubEvent(away, '263', '706') +
    getSubEvent(away, '263', '707') +
    getSubEvent(away, '263', '711')
  const aLineThrown =
    getEvent(away, '151') +
    getEvent(away, '150') +
    getEvent(away, '152') +
    getEvent(away, '263')

  const hScrum =
    getSubEvent(home, '51', '38') +
    getSubEvent(home, '63', '47') +
    getSubEvent(home, '76', '88') +
    getSubEvent(home, '262', '702')
  const hTotalScrum =
    hScrum +
    getSubEvent(home, '51', '39') +
    getSubEvent(home, '63', '48') +
    getSubEvent(home, '76', '89') +
    getSubEvent(home, '262', '703')

  const aScrum =
    getSubEvent(away, '51', '38') +
    getSubEvent(away, '63', '47') +
    getSubEvent(away, '76', '88') +
    getSubEvent(away, '262', '702')
  const aTotalScrum =
    aScrum +
    getSubEvent(away, '51', '39') +
    getSubEvent(away, '63', '48') +
    getSubEvent(away, '76', '89') +
    getSubEvent(away, '262', '703')

  const homeSuccKicks =
    getSubEvent(home, '33', '52') +
    getSubEvent(home, '49', '60') +
    getSubEvent(home, '79', '92') +
    getSubEvent(home, '79', '311') +
    getSubEvent(home, '49', '44') +
    getSubEvent(home, '79', '94') +
    getSubEvent(home, '33', '53') +
    getSubEvent(home, '253', '635') +
    getSubEvent(home, '253', '634')
  const awaySuccKicks =
    getSubEvent(away, '33', '52') +
    getSubEvent(away, '49', '60') +
    getSubEvent(away, '79', '92') +
    getSubEvent(away, '79', '311') +
    getSubEvent(away, '49', '44') +
    getSubEvent(away, '79', '94') +
    getSubEvent(away, '33', '53') +
    getSubEvent(away, '253', '635') +
    getSubEvent(away, '253', '634')

  const statsList = [
    {
      stat: 'Tries scored',
      home:
        getSubEvent(home, '33', '51') +
        getSubEvent(home, '33', '142') +
        getSubEvent(home, '49', '66') +
        getSubEvent(home, '49', '200') +
        getSubEvent(home, '79', '91') +
        getSubEvent(home, '79', '201') +
        getSubEvent(home, '253', '638') +
        getSubEvent(home, '253', '639'),
      away:
        getSubEvent(away, '33', '51') +
        getSubEvent(away, '33', '142') +
        getSubEvent(away, '49', '66') +
        getSubEvent(away, '49', '200') +
        getSubEvent(away, '79', '91') +
        getSubEvent(away, '79', '201') +
        getSubEvent(away, '253', '638') +
        getSubEvent(away, '253', '639'),
    },
    {
      stat: 'successful conversions',
      home: homeSuccKicks,
      away: awaySuccKicks,
    },
    {
      stat: 'Visit in opponents 22',
      home:
        getEvent(home, '122') +
        getEvent(home, '104') +
        getEvent(home, '123') +
        getEvent(home, '245'),
      away:
        getEvent(away, '122') +
        getEvent(away, '104') +
        getEvent(away, '123') +
        getEvent(away, '245'),
    },
    {
      stat: 'Penalties conceded',
      home:
        getEvent(home, '46') +
        getEvent(home, '60') +
        getEvent(home, '78') +
        getEvent(home, '257'),
      away:
        getEvent(away, '46') +
        getEvent(away, '60') +
        getEvent(away, '78') +
        getEvent(away, '257'),
    },
    {
      stat: 'Handling Errors',
      home:
        getEvent(home, '35') +
        getEvent(home, '41') +
        getEvent(home, '112') +
        getEvent(home, '86') +
        getEvent(home, '87') +
        getEvent(home, '119') +
        getEvent(home, '36') +
        getEvent(home, '40') +
        getEvent(home, '80') +
        getEvent(home, '149') +
        getEvent(home, '103') +
        getEvent(home, '145') +
        getEvent(home, '255'),
      away:
        getEvent(away, '35') +
        getEvent(away, '41') +
        getEvent(away, '112') +
        getEvent(away, '86') +
        getEvent(away, '87') +
        getEvent(away, '119') +
        getEvent(away, '36') +
        getEvent(away, '40') +
        getEvent(away, '80') +
        getEvent(away, '149') +
        getEvent(away, '103') +
        getEvent(away, '145') +
        getEvent(away, '255'),
    },
    {
      stat: 'scrums won / fed',
      home: `${hScrum} / ${hTotalScrum}`,
      away: `${aScrum} / ${aTotalScrum}`,
    },

    {
      stat: 'lineouts won / thrown',
      home: `${hLineWon} / ${hLineThrown}`,
      away: `${aLineWon} / ${aLineThrown}`,
    },

    {
      stat: 'Turnovers Won',
      home:
        getEvent(home, '45') +
        getEvent(home, '59') +
        getEvent(home, '77') +
        getEvent(home, '258'),
      away:
        getEvent(away, '45') +
        getEvent(away, '59') +
        getEvent(away, '77') +
        getEvent(away, '258'),
    },
  ]

  ;(homeYellow >= 1 || awayYellow >= 1) &&
    statsList.push({
      stat: 'Yellow cards',
      home: `${homeYellow}`,
      away: `${awayYellow}`,
    })

  ;(homeRed >= 1 || awayRed >= 1) &&
    statsList.push({
      stat: 'red cards',
      home: `${homeRed}`,
      away: `${awayRed}`,
    })

  return statsList
}

export const footballLowerThirdStats = (data: FixtureStats) => {
  if (!data?.home || !data?.away) return []

  const home = data.home as FixtureEvent[]
  const away = data.away as FixtureEvent[]

  const homeYellow = getSubEvent(home, '5', '21')
  const awayYellow = getSubEvent(away, '5', '21')
  const homeRed = getSubEvent(home, '5', '22')
  const awayRed = getSubEvent(away, '5', '22')

  const statsList = [
    {
      stat: 'Attempts on target',
      home: getSubEvent(home, '165', '422'),
      away: getSubEvent(away, '165', '422'),
    },
    {
      stat: 'Attempts off target',
      home: getSubEvent(home, '165', '423'),
      away: getSubEvent(away, '165', '423'),
    },
    {
      home: getEvent(home, '203'),
      stat: 'chances created',
      away: getEvent(away, '203'),
    },
    {
      home: getEvent(home, '155'),
      stat: 'touches in opp box',
      away: getEvent(away, '155'),
    },
    {
      home: getEvent(home, '7'),
      stat: 'Complete passes',
      away: getEvent(away, '7'),
    },
    {
      home: getEvent(home, '3'),
      stat: 'Corner kicks',
      away: getEvent(away, '3'),
    },
    {
      home: getEvent(home, '10'),
      stat: 'offsides',
      away: getEvent(away, '10'),
    },
    {
      home: getSubEvent(home, '11', '74'),
      stat: 'fouls committed',
      away: getSubEvent(away, '11', '74'),
    },
  ]

  ;(homeYellow >= 1 || awayYellow >= 1) &&
    statsList.push({
      stat: 'Yellow cards',
      home: homeYellow,
      away: awayYellow,
    })

  ;(homeRed >= 1 || awayRed >= 1) &&
    statsList.push({
      stat: 'red cards',
      home: homeRed,
      away: awayRed,
    })

  return statsList
}
