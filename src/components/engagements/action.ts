import type { Engagement } from '#/lib/types'

export type EngagementAction = 'play' | 'leaderboard' | 'upcoming'

function parseQuizDate(value: string): Date {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
}

export function getEngagementAction(
  quiz: Pick<Engagement, 'status' | 'starts_at' | 'ends_at'>,
  now = new Date(),
): EngagementAction {
  const startsAt = parseQuizDate(quiz.starts_at)
  const endsAt = parseQuizDate(quiz.ends_at)
  const status = quiz.status.toUpperCase()

  if (now > endsAt || status === 'CL' || status === 'EN' || status === 'ED') {
    return 'leaderboard'
  }

  if (status === 'OP' && now >= startsAt) {
    return 'play'
  }

  return 'upcoming'
}
