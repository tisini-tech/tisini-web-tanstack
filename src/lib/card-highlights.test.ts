import { describe, expect, it } from 'vitest'

import { cardIconsByHighlightId } from './card-highlights'
import type { FixtureHighlight } from './types'

function card(
  partial: Partial<FixtureHighlight> & Pick<FixtureHighlight, 'id'>,
): FixtureHighlight {
  return {
    event_name: 'Card',
    event_id: 5,
    time: '',
    team: 1,
    gameid: 1,
    narration: '',
    player_id: 10,
    subevent_id: '21',
    subevent_name: 'Yellow',
    subplayer_id: '',
    subplayer_name: '',
    game_minute: '10',
    game_second: '0',
    game_moment: 'firsthalf',
    teamplayer_id: '10',
    player_type: '',
    pname: 'Player',
    jersey_no: '7',
    subsubevent_id: '',
    quarter: '',
    ...partial,
  }
}

describe('cardIconsByHighlightId', () => {
  it('uses second-yellow sub-event ids 695 and 826', () => {
    const icons = cardIconsByHighlightId([
      card({ id: 1, subevent_id: '695', subevent_name: 'Red (Second Yellow)' }),
      card({ id: 2, subevent_id: '826', subevent_name: 'Red (Second Yellow)' }),
    ])

    expect(icons.get(1)).toBe('second_yellow')
    expect(icons.get(2)).toBe('second_yellow')
  })

  it('uses the straight-red sub-event ids', () => {
    const icons = cardIconsByHighlightId([
      card({ id: 1, subevent_id: '22', subevent_name: 'Red' }),
      card({ id: 2, subevent_id: '45', subevent_name: 'Red' }),
      card({ id: 3, subevent_id: '55', subevent_name: 'Red' }),
      card({ id: 4, subevent_id: '460', subevent_name: 'Red' }),
      card({ id: 5, subevent_id: '545', subevent_name: 'Red' }),
      card({ id: 6, subevent_id: '693', subevent_name: 'Straight Red' }),
    ])

    for (const id of [1, 2, 3, 4, 5, 6]) {
      expect(icons.get(id)).toBe('red_card')
    }
  })

  it('leaves a later yellow as a yellow when it is not a second-yellow id', () => {
    const icons = cardIconsByHighlightId([
      card({ id: 1, subevent_id: '21', subevent_name: 'Yellow' }),
      card({
        id: 2,
        subevent_id: '54',
        subevent_name: 'Yellow',
        event_id: 66,
      }),
    ])

    expect(icons.get(1)).toBe('yellow_card')
    expect(icons.get(2)).toBe('yellow_card')
  })
})