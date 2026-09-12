import { apiService } from '#/lib/api'
import { normalizeSeasonId } from '#/lib/leagues'
import {
  extractFixtureDatesPayload,
  isLiveFixtureStatus,
  normalizeFixtureDates,
} from '#/lib/scores'
import { createServerFn } from '@tanstack/react-start'
import { queryOptions } from '@tanstack/react-query'

import type {
  Fixture,
  FixtureDetails,
  FixtureLineups,
  Standings,
  TopEventPlayer,
  TopPlayer,
} from '#/lib/types'

export const getFixtureDates = createServerFn({ method: 'GET' })
  .validator((data: { fixType: string }) => data)
  .handler(async ({ data }) => {
    const res = await apiService.get<unknown>(
      `/scores/match-dates/${data.fixType}`,
      { target: 'scores' },
    )

    return normalizeFixtureDates(extractFixtureDatesPayload(res))
  })

export const fixtureDatesQueryOptions = (fixType: string) =>
  queryOptions({
    queryKey: ['scores', 'dates', fixType],
    queryFn: () => getFixtureDates({ data: { fixType } }),
  })

export const getFixturesByDate = createServerFn({ method: 'GET' })
  .validator((data: { fixType: string; date: string }) => data)
  .handler(async ({ data }) => {
    const res = await apiService.get<Fixture[]>(
      `/scores/matches-by-date/${data.date}?fixture_type=${data.fixType}&new=true`,
      { target: 'scores' },
    )

    return res
  })

export const fixturesByDateQueryOptions = (
  fixType: string,
  date: string | null,
) =>
  queryOptions({
    queryKey: ['scores', 'fixtures', fixType, date ?? 'none'],
    queryFn: async () => {
      if (!date) return [] as Fixture[]
      return getFixturesByDate({ data: { fixType, date } })
    },
  })

export const getFixtureDetails = createServerFn({ method: 'GET' })
  .validator((data: { fixtureId: string }) => data)
  .handler(async ({ data }) => {
    const res = await apiService.get<FixtureDetails>(
      `/scores/match-details/${data.fixtureId}`,
      { target: 'scores' },
    )
    return res
  })

export const fixtureDetailsQueryOptions = (fixtureId: string) =>
  queryOptions({
    queryKey: ['scores', 'fixture-details', fixtureId],
    queryFn: () => getFixtureDetails({ data: { fixtureId } }),
    refetchInterval(query) {
      const status = query.state.data?.fixture.game_status
      return status && isLiveFixtureStatus(status) ? 1_000 : false
    },
    refetchOnWindowFocus(query) {
      const status = query.state.data?.fixture.game_status
      return Boolean(status && isLiveFixtureStatus(status))
    },
  })

export const getFixtureLineups = createServerFn({ method: 'GET' })
  .validator((data: { fixtureId: string }) => data)
  .handler(async ({ data }) => {
    const res = await apiService.get<FixtureLineups>(
      `/scores/match-lineups/${data.fixtureId}`,
      { target: 'scores' },
    )
    return res
  })

export const fixtureLineupsQueryOptions = (fixtureId: string) =>
  queryOptions({
    queryKey: ['scores', 'fixture-lineups', fixtureId],
    queryFn: () => getFixtureLineups({ data: { fixtureId } }),
  })

export const getSeasonFixtures = createServerFn({ method: 'GET' })
  .validator((data: { tournId: string; seasonId: string }) => data)
  .handler(async ({ data }) => {
    const seasonId = normalizeSeasonId(data.seasonId) ?? data.seasonId
    const res = await apiService.get<Fixture[]>(
      `/competitions/${data.tournId}/seasons/${seasonId}/fixtures`,
      { target: 'scores' },
    )
    return res
  })

export const seasonFixturesQueryOptions = (tournId: string, seasonId: string) =>
  queryOptions({
    queryKey: ['scores', 'season-fixtures', tournId, seasonId],
    enabled: Boolean(tournId && seasonId),
    queryFn: () => getSeasonFixtures({ data: { tournId, seasonId } }),
  })

export const getSeasonTopscorers = createServerFn({ method: 'GET' })
  .validator((data: { tournId: string; seasonId: string }) => data)
  .handler(async ({ data }) => {
    const seasonId = normalizeSeasonId(data.seasonId) ?? data.seasonId
    const res = await apiService.get<TopEventPlayer | TopPlayer[]>(
      `/competitions/${data.tournId}/seasons/${seasonId}/events/19/top-performers?page_size=200`,
      { target: 'scores' },
    )

    if (Array.isArray(res)) return res
    return res.items ?? []
  })

export const seasonTopscorersQueryOptions = (
  tournId: string,
  seasonId: string,
) =>
  queryOptions({
    queryKey: ['scores', 'season-topscorers', tournId, seasonId],
    enabled: Boolean(tournId && seasonId),
    queryFn: () => getSeasonTopscorers({ data: { tournId, seasonId } }),
  })

export const getSeasonStandings = createServerFn({ method: 'GET' })
  .validator((data: { tournId: string; seasonId: string }) => data)
  .handler(async ({ data }) => {
    const seasonId = normalizeSeasonId(data.seasonId) ?? data.seasonId
    const res = await apiService.get<Standings>(
      `/competitions/${data.tournId}/seasons/${seasonId}/standings/`,
      { target: 'scores' },
    )

    return res
  })

export const seasonStandingsQueryOptions = (
  tournId: string,
  seasonId: string,
) =>
  queryOptions({
    queryKey: ['scores', 'season-standings', tournId, seasonId],
    enabled: Boolean(tournId && seasonId),
    queryFn: () => getSeasonStandings({ data: { tournId, seasonId } }),
  })
