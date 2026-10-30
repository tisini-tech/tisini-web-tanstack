import type { FixtureHighlight } from '#/lib/types'
import {
  isRugbyCardEvent,
  normalizeMetricName,
  resolveRugbyCardKind,
  SECOND_YELLOW_SUBEVENT_IDS,
  STRAIGHT_RED_SUBEVENT_IDS,
  type RugbyCardKind,
} from '#/lib/rugby-highlight-metrics'

export type CardKind = RugbyCardKind

export type CardIconType = 'yellow_card' | 'second_yellow' | 'red_card'

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

/** Yellow, second yellow, or straight red from the catalogued sub-event id. */
export function namedCardKind(highlight: FixtureHighlight): CardKind {
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

/** Icon for each card highlight. Kind comes from the sub-event id. */
export function cardIconsByHighlightId(
  highlights: FixtureHighlight[],
): Map<number, CardIconType> {
  const icons = new Map<number, CardIconType>()

  for (const highlight of highlights) {
    if (!isCardHighlight(highlight)) continue

    const kind = namedCardKind(highlight)
    icons.set(
      highlight.id,
      kind === 'red'
        ? 'red_card'
        : kind === 'second_yellow'
          ? 'second_yellow'
          : 'yellow_card',
    )
  }

  return icons
}
