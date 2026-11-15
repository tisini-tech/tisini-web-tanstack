import { describe, expect, it } from 'vitest'

import type { Fixture } from './types'
import { sortRugby15ForResults } from './scores'

function fixture(
  partial: Pick<Fixture, 'id' | 'stage' | 'stage_name' | 'matchday'> &
    Partial<Fixture>,
): Fixture {
  return {
    game_status: 'FT',
    game_date: '2026-01-01',
    ...partial,
  } as Fixture
}

describe('sortRugby15ForResults', () => {
  it('puts knockout stages above league matchdays', () => {
    const sections = sortRugby15ForResults([
      fixture({
        id: 1,
        stage: '646',
        stage_name: 'League',
        matchday: 'Round 2',
      }),
      fixture({
        id: 2,
        stage: '647',
        stage_name: 'Quarter Finals',
        matchday: 'Quarter Finals',
      }),
      fixture({
        id: 3,
        stage: '646',
        stage_name: 'League',
        matchday: 'Round 11',
      }),
      fixture({
        id: 4,
        stage: '649',
        stage_name: 'Final',
        matchday: 'Final',
      }),
      fixture({
        id: 5,
        stage: '648',
        stage_name: 'Semi-Finals',
        matchday: 'Semi-Finals',
      }),
      fixture({
        id: 6,
        stage: '646',
        stage_name: 'League',
        matchday: 'Round 11',
      }),
    ])

    expect(sections.map(([label]) => label)).toEqual([
      'Final',
      'Semi-Finals',
      'Quarter Finals',
      'Round 11',
      'Round 2',
    ])
    expect(sections[3]?.[1].map((item) => item.id)).toEqual([3, 6])
    expect(sections[0]?.[1].map((item) => item.id)).toEqual([4])
  })

  it('keeps a live league round under the knockout stages', () => {
    const sections = sortRugby15ForResults([
      fixture({
        id: 1,
        stage: '649',
        stage_name: 'Final',
        matchday: 'Final',
      }),
      fixture({
        id: 2,
        stage: '646',
        stage_name: 'League',
        matchday: 'Round 4',
        game_status: 'started',
      }),
      fixture({
        id: 3,
        stage: '646',
        stage_name: 'League',
        matchday: 'Round 3',
      }),
    ])

    expect(sections.map(([label]) => label)).toEqual([
      'Final',
      'Round 4',
      'Round 3',
    ])
  })
})
