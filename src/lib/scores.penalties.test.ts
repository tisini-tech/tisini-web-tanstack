import { describe, expect, it } from 'vitest'

import { parsePenaltyScore } from './scores'

describe('parsePenaltyScore', () => {
  it('returns the shootout when either side scored', () => {
    expect(parsePenaltyScore('5', '4')).toEqual({ home: 5, away: 4 })
    expect(parsePenaltyScore('3', '3')).toEqual({ home: 3, away: 3 })
  })

  it('hides matches that did not go to penalties', () => {
    expect(parsePenaltyScore('0', '0')).toBeNull()
    expect(parsePenaltyScore('', '')).toBeNull()
    expect(parsePenaltyScore(null, null)).toBeNull()
  })
})
