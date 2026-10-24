import { describe, expect, it } from 'vitest'

import { runningMatchClock } from './scores'

describe('runningMatchClock', () => {
  const start = Date.parse('2026-10-24T12:00:00Z')

  it('counts first-half seconds from started_at', () => {
    expect(
      runningMatchClock(
        {
          game_status: 'started',
          game_moment: 'firsthalf',
          fixture_type: 'football',
          started_at: '2026-10-24T12:00:00Z',
          started_second_half_at: null,
        },
        start + 125_000,
      ),
    ).toBe('2:05')
  })

  it('adds the regulation half once the second half has started', () => {
    expect(
      runningMatchClock(
        {
          game_status: 'started',
          game_moment: 'secondhalf',
          fixture_type: 'football',
          started_at: '2026-10-24T12:00:00Z',
          started_second_half_at: '2026-10-24T13:00:00Z',
        },
        Date.parse('2026-10-24T13:00:00Z') + 95_000,
      ),
    ).toBe('46:35')
  })

  it('keeps status labels when the match is not running', () => {
    expect(
      runningMatchClock(
        {
          game_status: 'HT',
          game_moment: 'halftime',
          fixture_type: 'football',
          started_at: '2026-10-24T12:00:00Z',
          started_second_half_at: null,
        },
        start + 3_000_000,
      ),
    ).toBeNull()

    expect(
      runningMatchClock(
        {
          game_status: 'started',
          game_moment: 'secondhalf',
          fixture_type: 'football',
          started_at: '2026-10-24T12:00:00Z',
          started_second_half_at: null,
        },
        start + 4_000_000,
      ),
    ).toBeNull()
  })
})
