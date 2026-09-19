import type { Fixture } from './types'
import type { FixtureEvent } from '#/lib/types'

export const FIXTURE_TYPES = ['football', 'rugby', 'basketball'] as const
export type FixtureType = (typeof FIXTURE_TYPES)[number]

export const DEFAULT_FIXTURE_TYPE: FixtureType = 'football'

const RUGBY_FIXTURE_TYPES = new Set(['rugby', 'rugby7', 'rugby10', 'rugby15'])

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

  const raw = String(value)
    .trim()
    .replace(/^["']+|["']+$/g, '')
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
    if (
      'dates' in value &&
      Array.isArray((value as { dates: unknown }).dates)
    ) {
      return (value as { dates: unknown[] }).dates
    }

    if (
      'items' in value &&
      Array.isArray((value as { items: unknown }).items)
    ) {
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
    status === 'postponed' || status === 'cancelled' || status === 'abandoned'
  )
}

/** Match is in progress (incl. HT) — suitable for live refetch. */
export function isLiveFixtureStatus(status: string) {
  return status === 'started' || status === 'HT'
}

function normalizeGameMoment(moment?: string) {
  return (moment ?? '').toLowerCase().replace(/[-_\s]/g, '')
}

function isPlayingMoment(moment?: string) {
  const m = normalizeGameMoment(moment)
  return (
    m === 'firsthalf' ||
    m === 'secondhalf' ||
    m === 'extratime' ||
    m === 'extratime1' ||
    m === 'extratime2' ||
    m === 'extra1' ||
    m === 'extra2'
  )
}

function isHalfTimeMoment(moment?: string) {
  const m = normalizeGameMoment(moment)
  return m === 'halftime' || m === 'ht' || m === 'half'
}

/**
 * Display label for a fixture clock / status.
 * Prefer `game_moment` + `minute` when the API leaves `game_status` stuck on HT.
 */
export function matchStatusLabel(fixture: MatchStatusInput): string {
  const status = fixture.game_status
  const moment = normalizeGameMoment(fixture.game_moment)
  const minute = fixture.minute

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
  }

  // Stale HT (or started) while clearly in a playing period → show the clock
  if (
    (status === 'HT' || status === 'started') &&
    isPlayingMoment(fixture.game_moment) &&
    minute != null &&
    minute > 0
  ) {
    // Brief HT window at the start of the second half
    if (
      moment === 'secondhalf' &&
      (minute === 45 || minute === 46) &&
      status === 'started'
    ) {
      return 'HT'
    }
    // Stuck game_status=HT deep into a half — trust minute
    if (status === 'HT' && moment === 'secondhalf' && minute > 46) {
      return `${minute}'`
    }
    if (status === 'HT' && moment === 'firsthalf') {
      return `${minute}'`
    }
    if (status === 'started') {
      return `${minute}'`
    }
  }

  if (status === 'HT' || isHalfTimeMoment(fixture.game_moment)) {
    return 'HT'
  }

  if (status === 'started') {
    if (minute != null && minute > 0) return `${minute}'`
    return 'Live'
  }

  if (minute != null && minute > 0 && isPlayingMoment(fixture.game_moment)) {
    return `${minute}'`
  }

  if (minute != null && minute > 0) return `${minute}'`
  return status || ''
}

/** True when the label is a live minute clock (e.g. `88'`). */
export function isLiveMinuteLabel(label: string) {
  return /^\d+'$/.test(label.trim())
}

export function matchStatusClassName(status: string, label?: string) {
  if (isInactiveMatchStatus(status)) return 'text-amber-500/90'
  if (status === 'started' || (label != null && isLiveMinuteLabel(label))) {
    return 'text-emerald-400/90'
  }
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
