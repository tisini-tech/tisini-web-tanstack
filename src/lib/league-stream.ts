import type { Fixture } from '#/lib/types'

const isLive = (status: string) =>
  status === 'started' || status === 'HT' || status === 'secondhalf'

const isFinished = (status: string) => status === 'ended' || status === 'FT'

const isUpcoming = (status: string) => status === 'notstarted'

const byMatchTime = (a: Fixture, b: Fixture) => {
  const aKey = `${a.game_date} ${a.matchtime}`
  const bKey = `${b.game_date} ${b.matchtime}`
  return aKey.localeCompare(bKey)
}

/** Prefer a live match, else hold the last finished fixture until the next kickoff. */
export function pickActiveFixtureId(fixtures: Fixture[]): string | null {
  const sorted = [...fixtures].sort(byMatchTime)

  const live = sorted.filter((fixture) => isLive(fixture.game_status))
  if (live.length) return live[0].id.toString()

  const finished = sorted.filter((fixture) => isFinished(fixture.game_status))
  const upcoming = sorted.filter((fixture) => isUpcoming(fixture.game_status))

  if (finished.length) return finished[finished.length - 1].id.toString()

  if (upcoming.length) return upcoming[0].id.toString()

  return sorted[0]?.id.toString() ?? null
}

export function isFootballFixType(fixType: string) {
  return fixType === 'football'
}

export function isRugbyFixType(fixType: string) {
  return fixType === 'rugby' || fixType === 'rugby7' || fixType === 'rugby15' || fixType === 'rugby10'
}
