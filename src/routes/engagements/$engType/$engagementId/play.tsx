import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'

import { absoluteUrl, resolveOgImage } from '#/lib/seo'
import { clearSessionFn, getUserFn } from '#/data/auth'
import { EngagementPlay } from '#/components/engagements/play'
import { getEngagementFn, getEngParticipationFn } from '#/data/quiz'
import { getEngagementAction } from '#/components/engagements/action'
import type { EngagementSection } from '#/components/engagements/engagement-card'

function isAuthError(message: string): boolean {
  return /not authenticated|token not valid|token expired|unauthorized|401/i.test(
    message,
  )
}

export const Route = createFileRoute(
  '/engagements/$engType/$engagementId/play',
)({
  beforeLoad: async ({ params }) => {
    try {
      const user = await getUserFn()
      return { user }
    } catch (error) {
      if (isRedirect(error)) {
        throw redirect({
          to: '/login',
          search: {
            redirect: `/engagements/${params.engType}/${params.engagementId}/play`,
          },
        })
      }
      throw error
    }
  },
  loader: async ({ params }) => {
    try {
      const [engagement, engParticipation] = await Promise.all([
        getEngagementFn({ data: { quizId: params.engagementId } }),
        getEngParticipationFn({ data: { quizId: params.engagementId } }),
      ])

      const action = getEngagementAction(engagement)

      if (engParticipation.has_played || action === 'leaderboard') {
        throw redirect({
          to: '/engagements/$engType/$engagementId/leaderboard',
          params: {
            engType: params.engType as EngagementSection,
            engagementId: params.engagementId,
          },
        })
      }

      if (action === 'upcoming') {
        throw redirect({
          to: '/engagements/$engType/$engagementId',
          params: {
            engType: params.engType as EngagementSection,
            engagementId: params.engagementId,
          },
        })
      }

      return { engagement }
    } catch (error) {
      // Redirects are thrown — don't treat them as load failures.
      if (isRedirect(error)) throw error

      const message =
        error instanceof Error ? error.message : 'Could not load engagement'

      if (isAuthError(message)) {
        await clearSessionFn()
        throw redirect({
          to: '/login',
          search: {
            redirect: `/engagements/${params.engType}/${params.engagementId}/play`,
          },
        })
      }

      throw error
    }
  },
  head: ({ loaderData, params }) => {
    const engagement = loaderData?.engagement
    const title = engagement?.title?.trim()
    const pageTitle = title
      ? `Play ${title} | ${params.engType} | Tisini`
      : `Play ${params.engType} | Tisini`
    const description =
      engagement?.description?.trim() ||
      (title
        ? `Play "${title}" on Tisini — test your sports knowledge.`
        : 'Play a quiz and test your knowledge on the latest sports news and events.')
    const canonical = absoluteUrl(
      `/engagements/${params.engType}/${params.engagementId}/play`,
    )
    const image = resolveOgImage(engagement?.image_url)
    const ogTitle = title || `${params.engType} | Tisini`

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: description },
        { name: 'robots', content: 'noindex' },

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

  return <EngagementPlay engagement={engagement} />
}
