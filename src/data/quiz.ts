import { apiService } from '#/lib/api'
import type {
  Engagement,
  EngLeaderboard,
  EngParticipation,
  EngSubmitResponse,
} from '#/lib/types'

import { createServerFn } from '@tanstack/react-start'

export const getEngagementsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const res = await apiService.get<Engagement[]>(
      '/engagements?type=QZ&company_id=1',
      {
        target: 'quiz',
        withApiKey: true,
      },
    )

    return res
  },
)

export const getEngagementFn = createServerFn({ method: 'GET' })
  .validator((data: { quizId: string }) => data)
  .handler(async ({ data }) => {
    return apiService.get<Engagement>(`/engagements/${data.quizId}/questions`, {
      target: 'quiz',
      withApiKey: true,
    })
  })

export const getEngParticipationFn = createServerFn({ method: 'GET' })
  .validator((data: { quizId: string }) => data)
  .handler(async ({ data }) => {
    return apiService.get<EngParticipation>(
      `/engagements/${data.quizId}/participation`,
      {
        target: 'quiz',
      },
    )
  })

export type QuizSubmitAnswer = {
  questionId: number
  choiceIds: number[]
  responseMs: number
}

export const submitQuizFn = createServerFn({ method: 'POST' })
  .validator((data: { quizId: string; answers: QuizSubmitAnswer[] }) => data)
  .handler(async ({ data }) => {
    return apiService.post<EngSubmitResponse>(
      `/engagements/${data.quizId}/answers`,
      data.answers.map((answer) => ({
        question_id: answer.questionId,
        choice_id: answer.choiceIds[0] ?? 0,
        selected_choice_ids:
          answer.choiceIds.length > 1 ? answer.choiceIds : [],
        text_answer: '',
        response_ms: answer.responseMs,
      })),
      {
        target: 'quiz',
        withApiKey: true,
      },
    )
  })

export const getQuizLeaderboardFn = createServerFn({ method: 'GET' })
  .validator((data: { quizId: string }) => data)
  .handler(async ({ data }) => {
    return apiService.get<EngLeaderboard[]>(
      `/engagements/${data.quizId}/leaderboard`,
      {
        target: 'quiz',
        withApiKey: true,
      },
    )
  })
