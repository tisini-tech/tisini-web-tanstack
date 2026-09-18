import { QuizPlay } from '#/components/quiz/quiz-play'
import { getEngagementFn, getEngParticipationFn } from '#/data/quiz'
import { clearSessionFn, getUserFn } from '#/data/auth'
import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'

function isAuthError(message: string): boolean {
  return /not authenticated|token not valid|token expired|unauthorized|401/i.test(
    message,
  )
}

export const Route = createFileRoute('/quiz/$quizId/')({
  beforeLoad: async ({ params }) => {
    try {
      const user = await getUserFn()
      return { user }
    } catch (error) {
      if (isRedirect(error)) {
        throw redirect({
          to: '/login',
          search: { redirect: `/quiz/${params.quizId}` },
        })
      }
      throw error
    }
  },
  loader: async ({ params }) => {
    try {
      const [engagement, engParticipation] = await Promise.all([
        getEngagementFn({ data: { quizId: params.quizId } }),
        getEngParticipationFn({ data: { quizId: params.quizId } }),
      ])

      if (engParticipation.has_played) {
        throw redirect({
          to: '/quiz/$quizId/leaderboard',
          params: { quizId: params.quizId },
        })
      }

      return { engagement }
    } catch (error) {
      // Redirects are thrown — don't treat them as load failures.
      if (isRedirect(error)) throw error

      const message =
        error instanceof Error ? error.message : 'Could not load quiz'

      if (isAuthError(message)) {
        await clearSessionFn()
        throw redirect({
          to: '/login',
          search: { redirect: `/quiz/${params.quizId}` },
        })
      }

      throw error
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { engagement } = Route.useLoaderData()

  return <QuizPlay quiz={engagement} />
}
