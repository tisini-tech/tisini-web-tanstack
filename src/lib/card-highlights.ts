import type { FixtureHighlight } from '#/lib/types'
import {
  isRugbyCardEvent,
  normalizeMetricName,
  resolveRugbyCardKind,
  RUGBY_CARD_EVENT_IDS,
  SECOND_YELLOW_SUBEVENT_IDS,
  STRAIGHT_RED_SUBEVENT_IDS,
  type RugbyCardKind,
} from '#/lib/rugby-highlight-metrics'

export type CardKind = RugbyCardKind

export type CardIconType = 'yellow_card' | 'second_yellow' | 'red_card'

/** Football `Card` event. Other football card ids were removed. */
const FOOTBALL_CARD_EVENT_ID = '5'
const FOOTBALL_YELLOW_SUBEVENT_IDS = new Set(['21', '60'])
const FOOTBALL_SECOND_YELLOW_SUBEVENT_ID = '61'
const FOOTBALL_RED_SUBEVENT_ID = '22'
const FOOTBALL_STRAIGHT_RED_SUBEVENT_ID = '62'

function cardLabel(highlight: FixtureHighlight) {
  return normalizeMetricName(
    `${highlight.event_name} ${highlight.subevent_name ?? ''}`,
  )
}

function isSecondYellowLabel(label: string) {
  return (
    label.includes('secondyellow') ||
    label.includes('2ndyellow') ||
    label.includes('doubleyellow')
  )
}

export function isCardHighlight(highlight: FixtureHighlight): boolean {
  if (isRugbyCardEvent(highlight.event_id, highlight.event_name)) return true
  const label = cardLabel(highlight)
  return (
    label === 'card' ||
    label.includes('yellow') ||
    label.includes('redcard') ||
    isSecondYellowLabel(label)
  )
}

function detailIds(highlight: FixtureHighlight) {
  return [highlight.subevent_id, highlight.subsubevent_id]
    .map((id) => String(id ?? '').trim())
    .filter(Boolean)
}

function hasDetailId(highlight: FixtureHighlight, id: string) {
  return detailIds(highlight).includes(id)
}

function isFootballCardHighlight(highlight: FixtureHighlight) {
  const eventId = String(highlight.event_id ?? '')
  if (RUGBY_CARD_EVENT_IDS.has(eventId)) return false
  return (
    eventId === FOOTBALL_CARD_EVENT_ID ||
    normalizeMetricName(highlight.event_name) === 'card'
  )
}

function hasSecondYellowSignal(highlight: FixtureHighlight) {
  if (hasDetailId(highlight, FOOTBALL_STRAIGHT_RED_SUBEVENT_ID)) return false
  if (hasDetailId(highlight, FOOTBALL_SECOND_YELLOW_SUBEVENT_ID)) return true
  return isSecondYellowLabel(cardLabel(highlight))
}

/** Red given for a second yellow (`22`), not a straight red (`62`). */
function isDismissingRed(highlight: FixtureHighlight) {
  if (hasDetailId(highlight, FOOTBALL_STRAIGHT_RED_SUBEVENT_ID)) return false
  return hasDetailId(highlight, FOOTBALL_RED_SUBEVENT_ID)
}

function footballCardKind(highlight: FixtureHighlight): CardKind {
  if (hasDetailId(highlight, FOOTBALL_STRAIGHT_RED_SUBEVENT_ID)) return 'red'
  if (hasSecondYellowSignal(highlight)) return 'second_yellow'
  if (
    isDismissingRed(highlight) ||
    cardLabel(highlight).includes('red')
  ) {
    return 'red'
  }
  if (
    detailIds(highlight).some((id) => FOOTBALL_YELLOW_SUBEVENT_IDS.has(id))
  ) {
    return 'yellow'
  }
  return 'yellow'
}

function cardMomentKey(highlight: FixtureHighlight) {
  const player = (
    highlight.pname ||
    highlight.player_id ||
    highlight.teamplayer_id
  )
    .toString()
    .trim()
    .toLowerCase()
  return `${highlight.team}:${player}:${highlight.game_moment}:${highlight.game_minute}`
}

/**
 * A second yellow and the red it produces are stored as two highlights.
 * Keep the second yellow and drop the red at that same minute.
 */
function hiddenFootballCardIds(highlights: FixtureHighlight[]) {
  const hidden = new Set<number>()
  const groups = new Map<string, FixtureHighlight[]>()

  for (const highlight of highlights) {
    if (!isFootballCardHighlight(highlight)) continue
    const key = cardMomentKey(highlight)
    const group = groups.get(key)
    if (group) group.push(highlight)
    else groups.set(key, [highlight])
  }

  for (const group of groups.values()) {
    const signals = group.filter(hasSecondYellowSignal)
    if (signals.length === 0) continue

    for (const highlight of group) {
      if (!isDismissingRed(highlight)) continue
      if (signals.some((signal) => signal.id !== highlight.id)) {
        hidden.add(highlight.id)
      }
    }
  }

  return hidden
}

/** Yellow, second yellow, or straight red from the catalogued sub-event id. */
export function namedCardKind(highlight: FixtureHighlight): CardKind {
  if (isFootballCardHighlight(highlight)) return footballCardKind(highlight)

  const id = String(highlight.subevent_id ?? '').trim()
  if (SECOND_YELLOW_SUBEVENT_IDS.has(id)) return 'second_yellow'
  if (STRAIGHT_RED_SUBEVENT_IDS.has(id)) return 'red'

  const label = cardLabel(highlight)
  if (isSecondYellowLabel(label)) return 'second_yellow'

  if (isRugbyCardEvent(highlight.event_id, highlight.event_name)) {
    return resolveRugbyCardKind(highlight.subevent_id, highlight.subevent_name)
  }

  if (label.includes('red')) return 'red'
  return 'yellow'
}

function iconForKind(kind: CardKind): CardIconType {
  if (kind === 'red') return 'red_card'
  if (kind === 'second_yellow') return 'second_yellow'
  return 'yellow_card'
}

export function resolveCardHighlightDisplay(highlights: FixtureHighlight[]): {
  icons: Map<number, CardIconType>
  hiddenIds: Set<number>
} {
  const hiddenIds = hiddenFootballCardIds(highlights)
  const icons = new Map<number, CardIconType>()

  for (const highlight of highlights) {
    if (!isCardHighlight(highlight) || hiddenIds.has(highlight.id)) continue
    icons.set(highlight.id, iconForKind(namedCardKind(highlight)))
  }

  return { icons, hiddenIds }
}

/** Icon for each card highlight. Kind comes from the sub-event id. */
export function cardIconsByHighlightId(
  highlights: FixtureHighlight[],
): Map<number, CardIconType> {
  return resolveCardHighlightDisplay(highlights).icons
}
