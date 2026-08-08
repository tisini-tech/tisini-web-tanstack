import { createServerFn } from '@tanstack/react-start'
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'

import { apiService } from '#/lib/api'
import type {
  Article,
  ArticleCategory,
  ArticleOverview,
  PaginatedResponse,
} from '#/lib/types'

const CATEGORY_PAGE_SIZE = 20

export const getArticlesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const articles = await apiService.get<PaginatedResponse<Article>>(
      '/articles',
      true,
    )

    return articles
  },
)

export const getArticlesByCategoryFn = createServerFn({ method: 'GET' })
  .validator(
    (data: { category: string; page?: number; page_size?: number }) => data,
  )
  .handler(async ({ data }) => {
    const page = data.page ?? 1
    const page_size = data.page_size ?? CATEGORY_PAGE_SIZE
    const params = new URLSearchParams({
      category: data.category,
      page: String(page),
      page_size: String(page_size),
    })

    const articles = await apiService.get<PaginatedResponse<Article>>(
      `/articles?${params.toString()}`,
      true,
    )

    return articles
  })

export const articlesQueryOptions = () =>
  queryOptions({
    queryKey: ['articles'],
    queryFn: getArticlesFn,
  })

export const articlesByCategoryInfiniteOptions = (category: string) =>
  infiniteQueryOptions({
    queryKey: ['articles', 'category', category],
    queryFn: ({ pageParam }) =>
      getArticlesByCategoryFn({
        data: {
          category,
          page: pageParam,
          page_size: CATEGORY_PAGE_SIZE,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  })

export const articlesOverviewFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const articles = await apiService.get<ArticleOverview>(
      '/articles/overview',
      true,
    )

    return articles
  },
)

export const articlesOverviewQueryOptions = () =>
  queryOptions({
    queryKey: ['articles', 'overview'],
    queryFn: articlesOverviewFn,
  })

export const articleCategoriesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const categories = await apiService.get<ArticleCategory[]>(
      '/categories',
      true,
    )

    return categories
  },
)

export const getArticleBySlugFn = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const article = await apiService.get<Article>(
      `/articles/${data.slug}`,
      true,
    )

    return article
  })

export const articleBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['articles', 'slug', slug],
    queryFn: () => getArticleBySlugFn({ data: { slug } }),
  })
