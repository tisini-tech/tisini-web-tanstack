export interface PaginatedResponse<T> {
  results: T[]
  count: number
  page_size: number
  page: number
  total_pages: number
}

export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string
  access_type: string
  status: string
  category: ArticleCategory
  keywords: string[]
  author: ArticleAuthor | null
  created_at: string
  published_at: string
  updated_at?: string
  content?: string
}

export interface ArticleCategory {
  id: number
  name: string
  slug: string
  description: string
}

export interface ArticleAuthor {
  id: number
  username: string
}

export interface ArticleOverview {
  featured: Article
  latest: Article[]
  categories: Record<string, Article[]>
}

export type FixtureDate = string
