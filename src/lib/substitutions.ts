import type { FixtureHighlight, FixtureLineup } from '#/lib/types'

export type SubAppearance = {
  direction: 'in' | 'out'
  minute: string
}

export type SubIndex = {
  byPlayerId: Map<number, SubAppearance>
  byTeamPlayerId: Map<number, SubAppearance>
  byName: Map<string, SubAppearance>
}

function normalizeName(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

function minuteOf(highlight: FixtureHighlight) {
  const minute = highlight.game_minute?.trim() || highlight.time?.trim() || ''
  return minute.replace(/'+$/, '')
}

/** Index substitution highlights for one team. `player_id` went off, `subplayer_id` came on. */
export function indexSubstitutions(
  highlights: FixtureHighlight[],
  teamId: number,
): SubIndex {
  const byPlayerId = new Map<number, SubAppearance>()
  const byTeamPlayerId = new Map<number, SubAppearance>()
  const byName = new Map<string, SubAppearance>()

  for (const highlight of highlights) {
    if (highlight.event_id !== 17 && highlight.event_name !== 'Substitute') {
      continue
    }
    if (highlight.team !== teamId) continue

    const minute = minuteOf(highlight)
    const outMark: SubAppearance = { direction: 'out', minute }
    const inMark: SubAppearance = { direction: 'in', minute }

    if (highlight.player_id) byPlayerId.set(highlight.player_id, outMark)

    const teamPlayerId = Number(highlight.teamplayer_id)
    if (Number.isFinite(teamPlayerId) && teamPlayerId > 0) {
      byTeamPlayerId.set(teamPlayerId, outMark)
    }

    if (highlight.pname?.trim()) {
      byName.set(normalizeName(highlight.pname), outMark)
    }

    const subPlayerId = Number(highlight.subplayer_id)
    if (Number.isFinite(subPlayerId) && subPlayerId > 0) {
      byPlayerId.set(subPlayerId, inMark)
    }

    if (highlight.subplayer_name?.trim()) {
      byName.set(normalizeName(highlight.subplayer_name), inMark)
    }
  }

  return { byPlayerId, byTeamPlayerId, byName }
}

export function substitutionForPlayer(
  index: SubIndex | undefined,
  player: FixtureLineup,
): SubAppearance | null {
  if (!index) return null

  return (
    index.byPlayerId.get(player.player) ??
    index.byTeamPlayerId.get(player.team_player_id) ??
    (player.pname ? index.byName.get(normalizeName(player.pname)) : undefined) ??
    null
  )
}
