import type { Fixture } from './types'
import type { FixtureEvent } from '#/lib/types'

export const FIXTURE_TYPES = ['football', 'rugby', 'basketball'] as const
export type FixtureType = (typeof FIXTURE_TYPES)[number]

export const DEFAULT_FIXTURE_TYPE: FixtureType = 'football'

const RUGBY_FIXTURE_TYPES = new Set([
  'rugby',
  'rugby7',
  'rugby10',
  'rugby15',
])

export function isRugbyFixtureType(value: string | null | undefined): boolean {
  if (!value) return false
  const normalized = value.toLowerCase()
  return RUGBY_FIXTURE_TYPES.has(normalized) || normalized.startsWith('rugby')
}

export function parseFixtureType(value: unknown): FixtureType {
  if (
    typeof value === 'string' &&
    (FIXTURE_TYPES as readonly string[]).includes(value)
  ) {
    return value as FixtureType
  }
  if (typeof value === 'string' && isRugbyFixtureType(value)) {
    return 'rugby'
  }
  return DEFAULT_FIXTURE_TYPE
}

export function normalizeFixtureDate(value: unknown): string | undefined {
  if (value == null || value === '') return undefined

  if (typeof value === 'object') {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString().slice(0, 10)
    }

    if ('date' in value) {
      return normalizeFixtureDate((value as { date: unknown }).date)
    }

    if ('match_date' in value) {
      return normalizeFixtureDate((value as { match_date: unknown }).match_date)
    }
  }

  if (typeof value !== 'string' && typeof value !== 'number') {
    return undefined
  }

  const raw = String(value).trim().replace(/^["']+|["']+$/g, '')
  if (raw === '[object Object]') return undefined
  if (!raw) return undefined

  const isoDate = raw.match(/^(\d{4}-\d{2}-\d{2})/)
  if (isoDate) return isoDate[1]

  const dmy = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (dmy) {
    const [, day, month, year] = dmy
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return raw
}

export function readFixtureSearchDate(location: {
  searchStr?: unknown
  search?: unknown
}): string | undefined {
  if (typeof location.searchStr === 'string' && location.searchStr.length > 0) {
    const query = location.searchStr.startsWith('?')
      ? location.searchStr.slice(1)
      : location.searchStr
    return normalizeFixtureDate(new URLSearchParams(query).get('date'))
  }

  if (location.search && typeof location.search === 'object') {
    return normalizeFixtureDate((location.search as { date?: unknown }).date)
  }

  return undefined
}

export function extractFixtureDatesPayload(value: unknown): unknown[] {
  if (Array.isArray(value)) return value

  if (value && typeof value === 'object') {
    if ('dates' in value && Array.isArray((value as { dates: unknown }).dates)) {
      return (value as { dates: unknown[] }).dates
    }

    if ('items' in value && Array.isArray((value as { items: unknown }).items)) {
      return (value as { items: unknown[] }).items
    }
  }

  return []
}

export function normalizeFixtureDates(values: unknown[]): string[] {
  const dates: string[] = []

  for (const value of values) {
    const date = normalizeFixtureDate(value)
    if (date && !dates.includes(date)) {
      dates.push(date)
    }
  }

  return dates
}

export function resolveFixtureDate(
  dates: string[],
  preferred?: string | null,
): string | null {
  const normalizedPreferred = normalizeFixtureDate(preferred)

  if (normalizedPreferred) {
    const match = dates.find(
      (entry) => normalizeFixtureDate(entry) === normalizedPreferred,
    )
    if (match) return normalizeFixtureDate(match) ?? normalizedPreferred
  }

  return dates[0] ?? null
}

export type MatchStatusInput = {
  game_status: string
  game_moment?: string
  minute?: number
  matchtime?: string
}

export function isInactiveMatchStatus(status: string) {
  return (
    status === 'postponed' ||
    status === 'cancelled' ||
    status === 'abandoned'
  )
}

export function matchStatusLabel(fixture: MatchStatusInput): string {
  const status = fixture.game_status

  switch (status) {
    case 'notstarted':
      return fixture.matchtime || ''
    case 'postponed':
      return 'Postponed'
    case 'cancelled':
      return 'Cancelled'
    case 'abandoned':
      return 'Abandoned'
    case 'FT':
    case 'ended':
      return 'FT'
    case 'HT':
      return 'HT'
    case 'started': {
      if (
        (fixture.minute === 45 || fixture.minute === 46) &&
        fixture.game_moment === 'secondhalf'
      ) {
        return 'HT'
      }
      if (fixture.minute) return `${fixture.minute}'`
      return 'Live'
    }
    default:
      if (fixture.minute) return `${fixture.minute}'`
      return status || ''
  }
}

export function matchStatusClassName(status: string) {
  if (isInactiveMatchStatus(status)) return 'text-amber-500/90'
  if (status === 'started') return 'text-emerald-400/90'
  return 'text-muted-foreground'
}

export function groupFixturesByMatchday(fixtures: Fixture[]) {
  const grouped: Record<string, Fixture[]> = {}

  for (const fixture of fixtures ?? []) {
    const round = fixture.matchday?.trim() || 'Fixtures'
    grouped[round] ??= []
    grouped[round].push(fixture)
  }

  return grouped
}

export function groupFixtures(fixtures: Fixture[]) {
  const grouped: Record<string, Record<string, Fixture[]>> = {}

  for (const fixture of fixtures ?? []) {
    const leagueKey = fixture.league_name || fixture.league || 'Unknown League'

    const division = (fixture.division_name || fixture.division || '').trim()
    const stage = (fixture.stage_name || fixture.stage || '').trim()

    let groupKey = ''
    if (division && stage) {
      groupKey = `${division} - ${stage}`
    } else if (division) {
      groupKey = division
    } else if (stage) {
      groupKey = stage
    }

    grouped[leagueKey] ??= {}
    grouped[leagueKey][groupKey] ??= []
    grouped[leagueKey][groupKey].push(fixture)
  }

  return grouped
}

export const getStat = (arry: FixtureEvent[], name: string) => {
  const event = Object.values(arry).find(
    (item) => item.event_name.toString() === name,
  )

  return Number(event?.total ?? 0)
}

export const getEvent = (array: FixtureEvent[], eventId: string): number => {
  const event = Object.values(array).find(
    (item) => item.event_id.toString() === eventId,
  )

  return Number(event?.total ?? 0)
}

export const getSubEvent = (
  array: FixtureEvent[],
  eventId: string,
  subEventId: string,
): number => {
  const event = Object.values(array).find(
    (item) => item.event_id.toString() === eventId,
  )

  const subEvent = event?.['sub_events']?.find(
    (item) => item.sub_event_id.toString() === subEventId,
  )

  return Number(subEvent?.total ?? 0)
}

export const calcBallPosession = (
  homeArry: FixtureEvent[],
  awayArry: FixtureEvent[],
) => {
  const homePasses =
    getEvent(homeArry, '7') +
    getEvent(homeArry, '25') +
    getEvent(homeArry, '95')

  const awayPasses =
    getEvent(awayArry, '7') +
    getEvent(awayArry, '25') +
    getEvent(awayArry, '95')

  const total = homePasses + awayPasses

  const home = Math.round((homePasses / total) * 100)
  const away = Math.round((awayPasses / total) * 100)

  return { home, away }
}

export const calcRugbyPosession = (
  homeArry: FixtureEvent[],
  awayArry: FixtureEvent[],
) => {
  const homePasses =
    getStat(homeArry, 'Pass') +
    getStat(homeArry, 'Incomplete Pass') +
    getStat(homeArry, 'Forward pass') +
    getSubEvent(homeArry, '255', '645') +
    getSubEvent(homeArry, '255', '644')

  const awayPasses =
    getStat(awayArry, 'Pass') +
    getStat(awayArry, 'Incomplete Pass') +
    getStat(awayArry, 'Forward pass') +
    getSubEvent(awayArry, '255', '645') +
    getSubEvent(awayArry, '255', '644')

  const total = homePasses + awayPasses

  const home = Math.round((homePasses / total) * 100)
  const away = Math.round((awayPasses / total) * 100)

  return { home, away }
}
