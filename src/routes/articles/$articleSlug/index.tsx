import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import ArticleDetail from '#/components/articles/article-detail'
import { articleBySlugQueryOptions } from '#/data/articles'
import { absoluteUrl, resolveOgImage } from '#/lib/seo'

export const Route = createFileRoute('/articles/$articleSlug/')({
  loader: async ({ context, params }) => {
    const { articleSlug } = params
    if (!articleSlug) throw notFound()

    try {
      const article = await context.queryClient.ensureQueryData(
        articleBySlugQueryOptions(articleSlug),
      )

      return { article }
    } catch {
      throw notFound()
    }
  },
  component: RouteComponent,
  head: ({ loaderData, params }) => {
    const article = loaderData?.article
    const title = article?.title?.trim()
    const pageTitle = title ? `${title} | Tisini` : 'Article | Tisini'
    const description =
      article?.excerpt?.trim() ||
      (title ? `${title} — Tisini` : 'Read the latest article from Tisini')
    const slug = article?.slug || params.articleSlug
    const canonical = absoluteUrl(`/articles/${slug}`)
    const image = resolveOgImage(article?.featured_image)
    const ogTitle = title || 'Article | Tisini'

    return {
      meta: [
        { title: pageTitle },
        { name: 'description', content: description },

        { property: 'og:site_name', content: 'Tisini' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: ogTitle },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: image },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: ogTitle },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },

        ...(article?.published_at
          ? [
              {
                property: 'article:published_time',
                content: article.published_at,
              },
            ]
          : []),
        ...(article?.author?.username
          ? [
              {
                property: 'article:author',
                content: article.author.username,
              },
            ]
          : []),
      ],
      links: [{ rel: 'canonical', href: canonical }],
    }
  },
})

function RouteComponent() {
  const { articleSlug } = Route.useParams()
  const { data: article } = useSuspenseQuery(
    articleBySlugQueryOptions(articleSlug),
  )

  return <ArticleDetail article={article} />
}
