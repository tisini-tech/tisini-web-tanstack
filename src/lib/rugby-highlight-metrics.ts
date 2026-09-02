/**
 * Rugby highlight event / subevent IDs across rugby7, rugby10, rugby15, and live API catalogs.
 */

export type RugbyScoreKind =
  | 'try'
  | 'conversion'
  | 'missed_conversion'
  | 'penalty'
  | 'missed_penalty'
  | 'drop'
  | 'missed_drop'

export type RugbyCardKind = 'yellow' | 'red'

/** Score event_ids: rugby7 / rugby15 / rugby10 / live */
export const RUGBY_SCORE_EVENT_IDS = new Set(['33', '49', '79', '253'])

/** Card event_ids: rugby7 / rugby10 / rugby15 / live */
export const RUGBY_CARD_EVENT_IDS = new Set(['66', '120', '55', '260'])

/** subevent_id → score kind */
export const RUGBY_SCORE_BY_SUBEVENT_ID: Record<string, RugbyScoreKind> = {
  // Try — rugby7, rugby15, rugby10, live
  '51': 'try',
  '66': 'try',
  '91': 'try',
  '638': 'try',
  // Successful conversion
  '52': 'conversion',
  '60': 'conversion',
  '92': 'conversion',
  '635': 'conversion',
  // Missed conversion
  '69': 'missed_conversion',
  '42': 'missed_conversion',
  '93': 'missed_conversion',
  '632': 'missed_conversion',
  // Successful penalty
  '312': 'penalty',
  '44': 'penalty',
  '94': 'penalty',
  '634': 'penalty',
  // Missed penalty
  '70': 'missed_penalty',
  '61': 'missed_penalty',
  '95': 'missed_penalty',
  '636': 'missed_penalty',
  // Successful drop goal
  '71': 'drop',
  '43': 'drop',
  '96': 'drop',
  '633': 'drop',
  // Missed drop goal
  '72': 'missed_drop',
  '62': 'missed_drop',
  '97': 'missed_drop',
  '637': 'missed_drop',
  // Extra metrics CSV aliases still seen in some feeds
  '142': 'try',
  '200': 'try',
  '201': 'try',
  '53': 'penalty',
  '311': 'conversion',
}

/** Normalized name fallback when subevent_id is missing */
export const RUGBY_SCORE_BY_SUBEVENT_NAME: Record<string, RugbyScoreKind> = {
  try: 'try',
  penaltytry: 'try',
  successfulconversion: 'conversion',
  conversion: 'conversion',
  missedconversion: 'missed_conversion',
  successfulpenalty: 'penalty',
  succesfulpenalty: 'penalty',
  missedpenalty: 'missed_penalty',
  successfuldropgoal: 'drop',
  dropgoal: 'drop',
  misseddropgoal: 'missed_drop',
}

/** subevent_id → card kind */
export const RUGBY_CARD_BY_SUBEVENT_ID: Record<string, RugbyCardKind> = {
  // Yellow — rugby15, rugby7, rugby10, live
  '46': 'yellow',
  '54': 'yellow',
  '544': 'yellow',
  '694': 'yellow',
  // Red — rugby15, rugby7, rugby10, live
  '45': 'red',
  '55': 'red',
  '545': 'red',
  '693': 'red',
}

export function normalizeMetricName(value: string | null | undefined): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

export function isRugbyScoreEvent(
  eventId: string | number | null | undefined,
  eventName: string | null | undefined,
): boolean {
  const id = String(eventId ?? '')
  if (id && RUGBY_SCORE_EVENT_IDS.has(id)) return true
  return normalizeMetricName(eventName) === 'score'
}

export function isRugbyCardEvent(
  eventId: string | number | null | undefined,
  eventName: string | null | undefined,
): boolean {
  const id = String(eventId ?? '')
  if (id && RUGBY_CARD_EVENT_IDS.has(id)) return true
  return normalizeMetricName(eventName) === 'card'
}

export function resolveRugbyScoreKind(
  subeventId: string | number | null | undefined,
  subeventName: string | null | undefined,
): RugbyScoreKind | null {
  const id = String(subeventId ?? '')
  if (id && RUGBY_SCORE_BY_SUBEVENT_ID[id]) {
    return RUGBY_SCORE_BY_SUBEVENT_ID[id]
  }

  const name = normalizeMetricName(subeventName)
  return RUGBY_SCORE_BY_SUBEVENT_NAME[name] ?? null
}

export function resolveRugbyCardKind(
  subeventId: string | number | null | undefined,
  subeventName: string | null | undefined,
): RugbyCardKind {
  const id = String(subeventId ?? '')
  if (id && RUGBY_CARD_BY_SUBEVENT_ID[id]) {
    return RUGBY_CARD_BY_SUBEVENT_ID[id]
  }

  const name = normalizeMetricName(subeventName)
  if (name.includes('red')) return 'red'
  return 'yellow'
}

export function isMissedRugbyScore(kind: RugbyScoreKind | null): boolean {
  return (
    kind === 'missed_conversion' ||
    kind === 'missed_penalty' ||
    kind === 'missed_drop'
  )
}

export function isSuccessfulRugbyScore(kind: RugbyScoreKind | null): boolean {
  return (
    kind === 'try' ||
    kind === 'conversion' ||
    kind === 'penalty' ||
    kind === 'drop'
  )
}
