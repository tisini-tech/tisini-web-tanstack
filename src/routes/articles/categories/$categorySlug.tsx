import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import CategoryPage from '#/components/articles/category-page'
import { articlesByCategoryInfiniteOptions } from '#/data/articles'

export const Route = createFileRoute('/articles/categories/$categorySlug')({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureInfiniteQueryData(
      articlesByCategoryInfiniteOptions(params.categorySlug),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { categorySlug } = Route.useParams()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    articlesByCategoryInfiniteOptions(categorySlug),
  )

  return (
    <CategoryPage
      categorySlug={categorySlug}
      pages={data.pages}
      hasNextPage={Boolean(hasNextPage)}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => {
        void fetchNextPage()
      }}
    />
  )
}
