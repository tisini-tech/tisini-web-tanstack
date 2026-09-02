import {
  HighlightIcon,
  type HighlightIconType,
} from '#/components/scores/highlight-icons'
import { isRugbyFixtureType } from '#/lib/scores'

type LegendItem = {
  type: Exclude<HighlightIconType, null>
  label: string
}

function legendForFixtureType(fixtureType: string): LegendItem[] {
  const shared: LegendItem[] = [
    { type: 'yellow_card', label: 'Yellow card' },
    { type: 'red_card', label: 'Red card' },
    { type: 'sub_out', label: 'Player off' },
    { type: 'sub_in', label: 'Player on' },
  ]

  if (isRugbyFixtureType(fixtureType)) {
    return [
      { type: 'try', label: 'Try' },
      { type: 'conversion', label: 'Conversion' },
      { type: 'missed_conversion', label: 'Missed conversion' },
      { type: 'penalty', label: 'Penalty' },
      { type: 'missed_penalty', label: 'Missed penalty' },
      { type: 'drop', label: 'Drop goal' },
      { type: 'missed_drop', label: 'Missed drop goal' },
      ...shared,
    ]
  }

  if (fixtureType.toLowerCase() === 'basketball') {
    return [
      { type: 'bb_two', label: '2 point' },
      { type: 'bb_three', label: '3 point' },
      { type: 'bb_ft', label: 'Free throw' },
      { type: 'assist', label: 'Assist' },
      ...shared,
    ]
  }

  // football (default)
  return [
    { type: 'goal', label: 'Goal' },
    { type: 'assist', label: 'Assist' },
    ...shared,
  ]
}

type HighlightLegendProps = {
  fixtureType: string
}

export function HighlightLegend({ fixtureType }: HighlightLegendProps) {
  const items = legendForFixtureType(fixtureType)

  return (
    <section
      aria-label="Event icon legend"
      className="mt-4 rounded-lg border border-border bg-muted/20 px-3 py-3 sm:px-4"
    >
      <h3 className="mb-2 font-heading text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Legend
      </h3>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <li
            key={`${item.type}-${item.label}`}
            className="flex items-center gap-2 text-xs text-foreground/90 sm:text-sm"
          >
            <HighlightIcon type={item.type} className="size-5" />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
