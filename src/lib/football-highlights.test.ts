import { describe, expect, it } from 'vitest'

import { footballPenaltyOutcome } from './football-highlights'

describe('footballPenaltyOutcome', () => {
  it('splits scored and missed shootout kicks by subevent id', () => {
    expect(footballPenaltyOutcome('309', null)).toBe('scored')
    expect(footballPenaltyOutcome(310, null)).toBe('missed')
  })

  it('falls back to the subevent name', () => {
    expect(footballPenaltyOutcome('', 'Scored')).toBe('scored')
    expect(footballPenaltyOutcome(null, 'Missed')).toBe('missed')
  })
})
