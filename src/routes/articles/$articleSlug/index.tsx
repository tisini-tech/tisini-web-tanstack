import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import ArticleDetail from '#/components/articles/article-detail'
import { articleBySlugQueryOptions } from '#/data/articles'

export const Route = createFileRoute('/articles/$articleSlug/')({
  loader: async ({ context, params }) => {
    const { articleSlug } = params
    if (!articleSlug) throw notFound()

    try {
      await context.queryClient.ensureQueryData(
        articleBySlugQueryOptions(articleSlug),
      )
    } catch {
      throw notFound()
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { articleSlug } = Route.useParams()
  const { data: article } = useSuspenseQuery(
    articleBySlugQueryOptions(articleSlug),
  )

  return <ArticleDetail article={article} />
}
