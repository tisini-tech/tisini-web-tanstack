/**
 * Basketball highlight score event / subevent IDs.
 * Parent score event_id: 169
 * Subevents: 434 = 2 point, 435 = 3 point, 436 = Free throw
 */

export type BasketballScoreKind = 'two_point' | 'three_point' | 'free_throw'

export const BASKETBALL_SCORE_EVENT_IDS = new Set(['169'])

export const BASKETBALL_SCORE_BY_SUBEVENT_ID: Record<
  string,
  BasketballScoreKind
> = {
  '434': 'two_point',
  '435': 'three_point',
  '436': 'free_throw',
}

export const BASKETBALL_SCORE_BY_SUBEVENT_NAME: Record<
  string,
  BasketballScoreKind
> = {
  '2point': 'two_point',
  twopoint: 'two_point',
  '3point': 'three_point',
  threepoint: 'three_point',
  freethrow: 'free_throw',
}

function normalizeName(value: string | null | undefined): string {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

export function isBasketballScoreEvent(
  eventId: string | number | null | undefined,
  eventName: string | null | undefined,
  subeventId?: string | number | null,
): boolean {
  const id = String(eventId ?? '')
  if (id && BASKETBALL_SCORE_EVENT_IDS.has(id)) return true

  const sid = String(subeventId ?? '')
  if (sid && BASKETBALL_SCORE_BY_SUBEVENT_ID[sid]) return true

  // Don't match bare "Score" by name — rugby also uses that label.
  const name = normalizeName(eventName)
  return name === 'points' || name === 'basket'
}

export function resolveBasketballScoreKind(
  subeventId: string | number | null | undefined,
  subeventName: string | null | undefined,
): BasketballScoreKind | null {
  const id = String(subeventId ?? '')
  if (id && BASKETBALL_SCORE_BY_SUBEVENT_ID[id]) {
    return BASKETBALL_SCORE_BY_SUBEVENT_ID[id]
  }
  return BASKETBALL_SCORE_BY_SUBEVENT_NAME[normalizeName(subeventName)] ?? null
}
