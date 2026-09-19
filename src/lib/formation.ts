import type { Formation, FormationRow, FixtureLineup } from '#/lib/types'

export type FormationBand = {
  /** Display label for the band (from formation row `line`). */
  label: string
  /** `lineupposition` values in pitch order (`slot`). */
  positions: number[]
}

function isRugbySport(sport?: string | null): boolean {
  if (!sport) return false
  const s = sport.toLowerCase()
  return s === 'rugby' || s.startsWith('rugby')
}

/**
 * Stream-only display names for formation `line` keys.
 * Backend keeps machine keys; this app owns the copy.
 */
const FOOTBALL_LINE_LABELS: Record<string, string> = {
  gk: 'Goalkeeper',
  goalkeeper: 'Goalkeeper',
  back: 'Defence',
  defence: 'Defence',
  defense: 'Defence',
  middle: 'Midfield',
  midfield: 'Midfield',
  mid: 'Midfield',
  // Attacking mid / wide band in shapes like 4-2-3-1 (before the striker line)
  front: 'Midfield',
  attacking_mid: 'Midfield',
  am: 'Midfield',
  // Final attack line
  front_front: 'Forwards',
  front_toward: 'Forwards',
  forward: 'Forwards',
  forwards: 'Forwards',
  striker: 'Forwards',
  attack: 'Forwards',
}

const RUGBY_LINE_LABELS: Record<string, string> = {
  // Pack
  forward: 'Forwards',
  forwards: 'Forwards',
  pack: 'Forwards',
  // Backline — must NOT use football "Defence"
  back: 'Backs',
  backs: 'Backs',
  backline: 'Backs',
  // Occasional extras
  gk: 'Fullback',
  goalkeeper: 'Fullback',
  middle: 'Backs',
  front: 'Backs',
  front_front: 'Backs',
  front_toward: 'Backs',
}

function normalizeSport(
  sport?: string | null,
): 'football' | 'rugby' | 'basketball' {
  if (!sport) return 'football'
  if (isRugbySport(sport)) return 'rugby'
  const s = sport.toLowerCase()
  if (s === 'basketball') return 'basketball'
  return 'football'
}

function labelsForSport(sport?: string | null): Record<string, string> {
  const family = normalizeSport(sport)
  if (family === 'rugby') return RUGBY_LINE_LABELS
  return FOOTBALL_LINE_LABELS
}

/**
 * Resolve a band label from API `line` keys.
 * Football: `front` is Midfield when a later `front_*` / striker band exists (4-2-3-1);
 * otherwise `front` is Forwards (4-4-2 / 4-3-3).
 */
export function resolveFormationLineLabel(
  line: string | null | undefined,
  options?: {
    sport?: string | null
    /** All `line` values in band order (goal → attack). */
    bandLines?: string[]
    bandIndex?: number
  },
): string {
  const raw = line?.trim() ?? ''
  if (!raw) return 'Line'
  const key = raw.toLowerCase().replace(/\s+/g, '_')
  const map = labelsForSport(options?.sport)

  // Contextual football: last outfield "front" band without a later attack line → Forwards
  if (
    normalizeSport(options?.sport) === 'football' &&
    key === 'front' &&
    options?.bandLines &&
    options.bandIndex != null
  ) {
    const later = options.bandLines.slice(options.bandIndex + 1).map((l) =>
      l.trim().toLowerCase().replace(/\s+/g, '_'),
    )
    const hasLaterAttack = later.some(
      (l) =>
        l === 'front_front' ||
        l === 'front_toward' ||
        l === 'striker' ||
        l === 'forwards' ||
        l === 'forward' ||
        l === 'attack' ||
        l.startsWith('front_'),
    )
    if (!hasLaterAttack) return 'Forwards'
    return 'Midfield'
  }

  if (map[key]) return map[key]

  // Unknown key: readable fallback (front_front → "Front front")
  return raw
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function bandLabel(
  band: FormationRow[],
  index: number,
  sport?: string | null,
  bandLines?: string[],
): string {
  const raw = band[0]?.line?.trim() || ''
  if (!raw) return `Line ${index + 1}`
  return resolveFormationLineLabel(raw, {
    sport,
    bandLines,
    bandIndex: index,
  })
}

function positionsFromBand(band: FormationRow[]): number[] {
  return [...band]
    .sort((a, b) => a.slot - b.slot)
    .map((s) => {
      // API: slot ↔ lineupposition; `number` is often null
      const pos = Number(s.number ?? s.slot)
      return pos
    })
    .filter((n) => Number.isFinite(n) && n > 0)
}

function isNestedBands(
  rows: Formation['rows'] | FormationRow[],
): rows is FormationRow[][] {
  return rows.length > 0 && Array.isArray(rows[0])
}

/**
 * Pitch bands as formation slots (goal → attack), each band sorted left→right by slot.
 * Prefers nested `rows`; falls back to flat rows + `columns_per_row`.
 */
export function getFormationBandRows(formation: Formation): FormationRow[][] {
  const rows = formation.rows ?? []
  if (rows.length === 0) return []

  if (isNestedBands(rows)) {
    return rows
      .map((band) => [...band].sort((a, b) => a.slot - b.slot))
      .filter((band) => band.length > 0)
  }

  const cols = formation.columns_per_row ?? []
  if (cols.length === 0) return []

  const slots = [...(rows as unknown as FormationRow[])].sort(
    (a, b) => a.slot - b.slot,
  )
  const bands: FormationRow[][] = []
  let offset = 0

  for (let i = 0; i < cols.length; i++) {
    const count = Math.max(0, cols[i] ?? 0)
    const slice = slots.slice(offset, offset + count)
    offset += count
    if (slice.length === 0) continue
    bands.push(slice)
  }

  return bands
}

/** Flat list of formation slots in pitch order (goal → attack, L→R within band). */
export function flattenFormationPositions(
  formation: Formation,
): FormationRow[] {
  return getFormationBandRows(formation).flat()
}

/**
 * Competition match_type IDs → type_code (Django MatchType).
 * Prefer this over role heuristics when formation.match_type is set.
 */
const MATCH_TYPE_BY_ID: Record<number, string> = {
  1: 'rugby15',
  2: 'rugby7',
  5: 'football',
  6: 'rugby10',
  7: 'basketball',
  8: 'hockey',
  9: 'handball',
  10: 'rugby',
}

export function matchTypeCode(
  matchTypeId: number | null | undefined,
): string | null {
  if (matchTypeId == null) return null
  return MATCH_TYPE_BY_ID[matchTypeId] ?? null
}

/** Infer sport family from formation.match_type, then line/role keys. */
export function inferFormationSport(
  formation: Formation,
): 'football' | 'rugby' {
  const code = matchTypeCode(formation.match_type)?.toLowerCase()
  if (code) {
    if (code === 'football') return 'football'
    if (code.startsWith('rugby')) return 'rugby'
  }

  const positions = flattenFormationPositions(formation)
  const footballHint = positions.some((p) => {
    const line = p.line?.toLowerCase() ?? ''
    const role = p.role?.toLowerCase() ?? ''
    return (
      line === 'gk' ||
      role === 'gk' ||
      role === 'st' ||
      role === 'cm' ||
      role === 'cb' ||
      role === 'rb' ||
      role === 'lb' ||
      role === 'rw' ||
      role === 'lw'
    )
  })
  return footballHint ? 'football' : 'rugby'
}

export type PitchOrientation = 'portrait' | 'landscape'

export type PitchPoint = { top: string; left: string }

function axisPercent(index: number, count: number, start: number, end: number) {
  if (count <= 1) return (start + end) / 2
  return start + ((end - start) * index) / (count - 1)
}

/**
 * Absolute % positions for jersey nodes on a pitch.
 * Portrait: attack toward top. Landscape: attack toward left.
 * API bands are goal → attack.
 */
export function buildFormationPitchLayout(
  formation: Formation,
  orientation: PitchOrientation,
): Record<number, PitchPoint> {
  const bands = getFormationBandRows(formation)
  const layout: Record<number, PitchPoint> = {}
  const n = bands.length
  if (n === 0) return layout

  // Keep jerseys inside the marked field (away from goals / touchlines).
  const depthStart = 14
  const depthEnd = 86
  const widthStart = 16
  const widthEnd = 84

  for (let i = 0; i < n; i++) {
    const band = bands[i]!
    // i=0 (goal) sits deep; last band sits near attack.
    const depth = axisPercent(i, n, depthEnd, depthStart)

    for (let j = 0; j < band.length; j++) {
      const pos = band[j]!
      const across = axisPercent(j, band.length, widthStart, widthEnd)

      if (orientation === 'portrait') {
        layout[pos.slot] = {
          top: `${depth}%`,
          left: `${across}%`,
        }
      } else {
        // Rotate CW: depth becomes horizontal (attack left), across becomes vertical.
        layout[pos.slot] = {
          top: `${across}%`,
          left: `${depth}%`,
        }
      }
    }
  }

  return layout
}

export function formationSlotLabel(position: FormationRow): string {
  return position.label || position.role || `Slot ${position.slot}`
}

export function formationSlotNumber(position: FormationRow): number {
  const n = Number(position.number ?? position.slot)
  return Number.isFinite(n) && n > 0 ? n : position.slot
}

export type BuildFormationBandsOptions = {
  /** Stream route `$fixType` — football | rugby | rugby7 | … */
  sport?: string | null
}

/**
 * Build pitch bands from API formation.
 * Rows are nested arrays (one band per line). `slot` maps to player.lineupposition.
 */
export function buildFormationBands(
  formation: Formation,
  options: BuildFormationBandsOptions = {},
): FormationBand[] {
  const slices = getFormationBandRows(formation)
  if (slices.length === 0) return []
  const sport = options.sport
  const bandLines = slices.map((s) => s[0]?.line?.trim() ?? '')

  return slices
    .map((band, index) => ({
      label: bandLabel(band, index, sport, bandLines),
      positions: positionsFromBand(band),
    }))
    .filter((band) => band.positions.length > 0)
}

export function formationStarterCount(
  formation: Formation,
  options: BuildFormationBandsOptions = {},
): number {
  const fromBands = buildFormationBands(formation, options).reduce(
    (sum, band) => sum + band.positions.length,
    0,
  )
  if (fromBands > 0) return fromBands
  return (formation.columns_per_row ?? []).reduce((sum, n) => sum + n, 0)
}

export function isSubstitute(player: FixtureLineup) {
  return (
    player.lineupposition === 1000 ||
    player.lineupposition == null ||
    player.player_type === 'sub'
  )
}

/** Map lineupposition → player for starters that appear in the formation. */
export function getStartersByPosition(
  players: FixtureLineup[],
  formationPositions?: Iterable<number>,
) {
  const allowed =
    formationPositions != null ? new Set(formationPositions) : null
  const byPos = new Map<number, FixtureLineup>()

  for (const player of players) {
    if (isSubstitute(player)) continue
    const pos = Number(player.lineupposition)
    if (!Number.isFinite(pos) || pos <= 0) continue
    if (allowed && !allowed.has(pos)) continue
    byPos.set(pos, player)
  }

  return byPos
}

export function getSubstitutes(players: FixtureLineup[]) {
  return players.filter(isSubstitute)
}

export function allFormationPositions(bands: FormationBand[]): number[] {
  return bands.flatMap((band) => band.positions)
}
