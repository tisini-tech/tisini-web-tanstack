import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'

import { QuizPlay } from '#/components/quiz/quiz-play'
import { clearSessionFn, getUserFn } from '#/data/auth'
import { absoluteUrl, resolveOgImage } from '#/lib/seo'
import { getEngagementFn, getEngParticipationFn } from '#/data/quiz'

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
  head: ({ loaderData, params }) => {
    const quiz = loaderData?.engagement
    const title = quiz?.title?.trim()
    const pageTitle = title ? `${title} | Quiz | Tisini` : 'Quiz | Tisini'
    const description =
      quiz?.description?.trim() ||
      (title
        ? `Play "${title}" on Tisini — test your sports knowledge.`
        : 'Play a quiz and test your knowledge on the latest sports news and events.')
    const canonical = absoluteUrl(`/quiz/${params.quizId}`)
    const image = resolveOgImage(quiz?.image_url)
    const ogTitle = title || 'Quiz | Tisini'

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: description },

        { property: 'og:site_name', content: 'Tisini' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: ogTitle },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: image },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: ogTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
      links: [{ rel: 'canonical', href: canonical }],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { engagement } = Route.useLoaderData()

  return <QuizPlay quiz={engagement} />
}
