/** Football penalty-shootout subevents on `PM Penalties`. */
const SCORED_PENALTY_SUBEVENT = '309'
const MISSED_PENALTY_SUBEVENT = '310'

export type FootballPenaltyOutcome = 'scored' | 'missed'

export function footballPenaltyOutcome(
  subeventId: string | number | null | undefined,
  subeventName?: string | null,
): FootballPenaltyOutcome | null {
  const id = String(subeventId ?? '').trim()
  if (id === SCORED_PENALTY_SUBEVENT) return 'scored'
  if (id === MISSED_PENALTY_SUBEVENT) return 'missed'

  const name = (subeventName ?? '').trim().toLowerCase()
  if (name === 'scored' || name === 'score') return 'scored'
  if (name === 'missed' || name === 'miss') return 'missed'
  return null
}
