import { cn } from '@/lib/utils'
import { resolveCardHighlightDisplay } from '#/lib/card-highlights'
import { footballPenaltyOutcome } from '#/lib/football-highlights'
import type { FixtureDetails, FixtureHighlight } from '#/lib/types'
import { HighlightLegend } from '#/components/scores/highlight-legend'
import {
  isBasketballScoreEvent,
  resolveBasketballScoreKind,
  type BasketballScoreKind,
} from '#/lib/basketball-highlight-metrics'
import {
  isMissedRugbyScore,
  isRugbyScoreEvent,
  isSuccessfulRugbyScore,
  normalizeMetricName,
  resolveRugbyScoreKind,
  type RugbyScoreKind,
} from '#/lib/rugby-highlight-metrics'
import {
  HighlightIcon,
  scoreKindToIconType,
  type HighlightIconType,
} from '#/components/scores/highlight-icons'

type FixtureOverviewProps = {
  teams: FixtureDetails['fixture']
  highlights: FixtureHighlight[]
}

export function FixtureOverview({ teams, highlights }: FixtureOverviewProps) {
  if (highlights.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-base text-muted-foreground sm:text-lg">
        No Data!
      </div>
    )
  }

  const penalties = highlights.filter(
    (highlight) => highlight.event_name === 'PM Penalties',
  )
  const { icons: cardIcons, hiddenIds: hiddenCards } =
    resolveCardHighlightDisplay(highlights)

  return (
    <div className="space-y-1">
      <HalfDivider label="First Half" />
      {highlights.map((highlight) =>
        highlight.game_moment === 'firsthalf' &&
        highlight.event_name !== 'Goal Conceded' &&
        !hiddenCards.has(highlight.id) ? (
          <HighlightsCard
            key={highlight.id}
            highlight={highlight}
            teams={teams}
            cardIcon={cardIcons.get(highlight.id)}
          />
        ) : null,
      )}

      <HalfDivider label="Second Half" />
      {highlights.map((highlight) =>
        highlight.game_moment === 'secondhalf' &&
        highlight.event_name !== 'Goal Conceded' &&
        highlight.event_name !== 'PM Penalties' &&
        !hiddenCards.has(highlight.id) ? (
          <HighlightsCard
            key={highlight.id}
            highlight={highlight}
            teams={teams}
            cardIcon={cardIcons.get(highlight.id)}
          />
        ) : null,
      )}

      {penalties.length > 0 ? (
        <>
          <HalfDivider label="Penalties" />
          {penalties.map((penalty) => (
            <HighlightsCard
              key={penalty.id}
              highlight={penalty}
              teams={teams}
            />
          ))}
        </>
      ) : null}

      <HighlightLegend
        fixtureType={teams.fixture_type}
        showPenaltyShootout={penalties.length > 0}
      />
    </div>
  )
}

function HalfDivider({ label }: { label: string }) {
  return (
    <div className="flex h-8 items-center justify-center border border-border bg-muted/40 font-heading text-xs font-semibold tracking-wide text-accent-foreground/90 uppercase sm:text-sm">
      {label}
    </div>
  )
}

type HighlightsCardProps = {
  highlight: FixtureHighlight
  teams: FixtureDetails['fixture']
  cardIcon?: HighlightIconType
}

function HighlightsCard({ highlight, teams, cardIcon }: HighlightsCardProps) {
  const homeId = teams.team1_id
  const isHome = highlight.team === homeId
  const subeventName = highlight.subevent_name ?? ''
  const rugbyScoreKind = isRugbyScoreEvent(
    highlight.event_id,
    highlight.event_name,
  )
    ? resolveRugbyScoreKind(highlight.subevent_id, subeventName)
    : null
  const basketballScoreKind = isBasketballScoreEvent(
    highlight.event_id,
    highlight.event_name,
    highlight.subevent_id,
  )
    ? resolveBasketballScoreKind(highlight.subevent_id, subeventName)
    : null

  const iconType =
    cardIcon ??
    getHighlightIconType(highlight, rugbyScoreKind, basketballScoreKind)

  if (highlight.event_name === 'Assists' && !highlight.pname?.trim()) {
    return null
  }

  const minute = `${highlight.game_minute}'`
  const penaltyOutcome =
    highlight.event_name === 'PM Penalties'
      ? footballPenaltyOutcome(highlight.subevent_id, subeventName)
      : null
  const missed =
    isMissedRugbyScore(rugbyScoreKind) || penaltyOutcome === 'missed'
  const successful =
    Boolean(basketballScoreKind) ||
    isSuccessfulRugbyScore(rugbyScoreKind) ||
    isSuccessfulScore(highlight.event_name, subeventName) ||
    highlight.event_name === 'Goal' ||
    penaltyOutcome === 'scored'

  if (highlight.event_name === 'Substitute') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 text-sm leading-snug',
          !isHome && 'justify-end',
        )}
      >
        {isHome ? (
          <>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {minute}
            </span>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 truncate capitalize text-red-400">
                <HighlightIcon type="sub_out" className="size-4" />
                {highlight.pname}
              </div>
              <div className="flex items-center gap-1.5 truncate capitalize text-emerald-400">
                <HighlightIcon type="sub_in" className="size-4" />
                {highlight.subplayer_name}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center justify-end gap-1.5 truncate capitalize text-red-400">
                {highlight.pname}
                <HighlightIcon type="sub_out" className="size-4" />
              </div>
              <div className="flex items-center justify-end gap-1.5 truncate capitalize text-emerald-400">
                {highlight.subplayer_name}
                <HighlightIcon type="sub_in" className="size-4" />
              </div>
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {minute}
            </span>
          </>
        )}
      </div>
    )
  }

  const rowClass = cn(
    'flex items-center gap-1.5 px-2 py-1.5 text-sm leading-snug capitalize',
    isHome ? '' : 'justify-end',
    missed || isMissedScore(highlight.event_name, subeventName)
      ? 'text-red-400'
      : successful
        ? 'text-emerald-400'
        : highlight.event_name === 'Assists'
          ? 'text-sky-400'
          : 'text-foreground/90',
  )

  const icon = <HighlightIcon type={iconType} />
  const name = (
    <span className="min-w-0 truncate">
      {highlight.event_name === 'Assists'
        ? `Assist · ${highlight.pname}`
        : highlight.pname}
    </span>
  )
  const time = (
    <span className="shrink-0 font-mono text-xs text-muted-foreground normal-case">
      {minute}
    </span>
  )

  return (
    <div className={rowClass}>
      {isHome ? (
        <>
          {time}
          {icon}
          {name}
        </>
      ) : (
        <>
          {name}
          {icon}
          {time}
        </>
      )}
    </div>
  )
}

function getHighlightIconType(
  highlight: FixtureHighlight,
  rugbyScoreKind: RugbyScoreKind | null,
  basketballScoreKind: BasketballScoreKind | null,
): HighlightIconType {
  const eventName = highlight.event_name
  const subeventName = highlight.subevent_name ?? ''

  if (normalizeMetricName(eventName) === 'card') {
    return normalizeMetricName(subeventName).includes('red')
      ? 'red_card'
      : 'yellow_card'
  }
  if (eventName === 'Assists') return 'assist'
  if (eventName === 'PM Penalties') {
    const outcome = footballPenaltyOutcome(highlight.subevent_id, subeventName)
    if (outcome === 'missed') return 'pm_missed'
    if (outcome === 'scored') return 'pm_scored'
    return 'goal'
  }
  if (eventName === 'Goal') return 'goal'

  if (
    isBasketballScoreEvent(highlight.event_id, eventName, highlight.subevent_id)
  ) {
    switch (basketballScoreKind) {
      case 'three_point':
        return 'bb_three'
      case 'free_throw':
        return 'bb_ft'
      case 'two_point':
      default:
        return 'bb_two'
    }
  }

  if (isRugbyScoreEvent(highlight.event_id, eventName)) {
    return scoreKindToIconType(rugbyScoreKind)
  }

  if (
    eventName === 'Score' &&
    (subeventName === 'Try' || subeventName === 'Penalty Try')
  ) {
    return 'try'
  }
  if (
    eventName === 'Score' &&
    (subeventName === 'Successful Conversion' || subeventName === 'Conversion')
  ) {
    return 'conversion'
  }
  if (eventName === 'Score' && subeventName === 'Missed Conversion') {
    return 'missed_conversion'
  }
  if (eventName === 'Score' && subeventName === 'Successful Penalty') {
    return 'penalty'
  }
  if (eventName === 'Score' && subeventName === 'Missed Penalty') {
    return 'missed_penalty'
  }
  if (eventName === 'Score' && subeventName === 'Successful Drop Goal') {
    return 'drop'
  }
  if (eventName === 'Score' && subeventName === 'Missed Drop Goal') {
    return 'missed_drop'
  }

  return null
}

function isMissedScore(eventName: string, subeventName: string) {
  return (
    eventName === 'Score' &&
    (subeventName === 'Missed Conversion' ||
      subeventName === 'Missed Penalty' ||
      subeventName === 'Missed Drop Goal')
  )
}

function isSuccessfulScore(eventName: string, subeventName: string) {
  return (
    eventName === 'Score' &&
    (subeventName === 'Successful Conversion' ||
      subeventName === 'Successful Penalty' ||
      subeventName === 'Successful Drop Goal' ||
      subeventName === 'Try' ||
      subeventName === 'Penalty Try' ||
      subeventName === 'Conversion')
  )
}
