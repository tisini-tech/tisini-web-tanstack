import { describe, expect, it } from 'vitest'

import { rugbyCardColumnTotals } from './rugby-highlight-metrics'

describe('rugbyCardColumnTotals', () => {
  it('counts yellow on its own and both red subevents as red', () => {
    expect(
      rugbyCardColumnTotals([
        { sub_event_id: '693', sub_event_name: 'Straight Red', total: 1 },
        { sub_event_id: '694', sub_event_name: 'Yellow', total: 2 },
        {
          sub_event_id: '695',
          sub_event_name: 'Red (Second Yellow)',
          total: 1,
        },
      ]),
    ).toEqual({ yellow: 2, red: 2 })
  })
})
