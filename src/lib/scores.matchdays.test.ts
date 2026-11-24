import { describe, expect, it } from 'vitest'

import type { Fixture } from './types'
import { sortMatchdaysForResults } from './scores'

function fixture(id: number, game_status: string): Fixture {
  return { id, game_status } as Fixture
}

describe('sortMatchdaysForResults', () => {
  it('keeps the latest round that has a result above later rounds', () => {
    const sections = sortMatchdaysForResults({
      '2026-12-31 - Round 11': [fixture(11, 'notstarted')],
      '2026-11-22 - Round 8': [fixture(8, 'FT')],
      '2026-12-02 - Round 8': [fixture(81, 'notstarted')],
      '2026-11-24 - Round 9': [fixture(9, 'FT')],
      '2026-11-26 - Round 9': [fixture(91, 'notstarted')],
    })

    expect(sections.map(([label]) => label)).toEqual([
      '2026-11-24 - Round 9',
      '2026-11-26 - Round 9',
      '2026-11-22 - Round 8',
      '2026-12-02 - Round 8',
      '2026-12-31 - Round 11',
    ])
  })

  it('keeps the previous matchday directly under the current one', () => {
    const sections = sortMatchdaysForResults({
      '2026-09-13 - Round 8': [fixture(8, 'FT')],
      '2026-11-08 - Round 9': [fixture(9, 'walkover')],
      '2026-11-22 - Round 10': [
        fixture(10, 'FT'),
        fixture(101, 'notstarted'),
      ],
      '2026-12-31 - Round 11': [fixture(11, 'notstarted')],
    })

    expect(sections.map(([label]) => label)).toEqual([
      '2026-11-22 - Round 10',
      '2026-11-08 - Round 9',
      '2026-09-13 - Round 8',
      '2026-12-31 - Round 11',
    ])
  })
})
