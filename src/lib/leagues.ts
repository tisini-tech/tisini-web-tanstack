import {
  leagues,
  type LeagueMenu,
  type SeasonMenu,
} from '#/components/scores/leagues/league-menu'

export function normalizeSeasonId(value: unknown): string | undefined {
  if (value == null || value === '') return undefined

  const raw = String(value)
    .trim()
    .replace(/^["']+|["']+$/g, '')
  return raw.length > 0 ? raw : undefined
}

export function buildLeagueSlug(sport: string, league: LeagueMenu) {
  const nameSlug = league.name.split(' ').join('-').toLowerCase()
  return `${sport}-${nameSlug}-${league.id}`
}

export function parseLeagueSlug(leagueId: string) {
  const id = leagueId.split('-').pop() ?? ''
  const sport = leagueId.split('-')[0] ?? ''
  const league = leagues[sport]?.find((l) => l.id === id)

  return { id, sport, league }
}

export function getDefaultSeasonId(league: LeagueMenu) {
  if (league.series) {
    return league.seasons[0]?.series[0]?.id ?? ''
  }
  return league.seasons[0]?.id ?? ''
}

export function getSeriesForSeason(
  league: LeagueMenu,
  seasonEntry?: SeasonMenu,
) {
  if (!league.series) return []
  const entry = seasonEntry ?? league.seasons[0]
  return entry?.series ?? []
}

export function findSeasonEntry(league: LeagueMenu, seasonId: string) {
  if (league.series) {
    for (const entry of league.seasons) {
      if (entry.series.some((s) => s.id === seasonId)) return entry
    }
    return league.seasons[0]
  }

  return (
    league.seasons.find((entry) => entry.id === seasonId) ?? league.seasons[0]
  )
}
