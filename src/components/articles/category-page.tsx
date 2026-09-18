import { Link } from '@tanstack/react-router'
import type { Article, PaginatedResponse } from '#/lib/types'
import { ArticleThumbCard } from './article-cards'

type CategoryPageProps = {
  categorySlug: string
  pages: PaginatedResponse<Article>[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}

function titleFromSlug(slug: string) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function CategoryPage({
  categorySlug,
  pages,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: CategoryPageProps) {
  const articles = pages.flatMap((page) => page.results)
  const firstPage = pages[0]
  const categoryName =
    articles[0]?.category?.name ?? titleFromSlug(categorySlug)
  const description = articles[0]?.category?.description
  const showDescription =
    Boolean(description) &&
    description!.trim().toLowerCase() !== categoryName.trim().toLowerCase()
  const totalCount = firstPage?.count ?? articles.length

  return (
    <div className="text-foreground">
        <nav className="mb-6 flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
          <Link
            to="/articles"
            className="transition-colors hover:text-accent-foreground"
          >
            Articles
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-accent-foreground">{categoryName}</span>
        </nav>

        <header className="mb-10 max-w-3xl">
          <p className="font-mono text-xs tracking-[0.2em] text-emerald-400/80 uppercase">
            Category
          </p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {categoryName}
          </h1>
          {showDescription && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
          {totalCount > 0 && (
            <p className="mt-2 font-mono text-xs text-muted-foreground/80">
              {totalCount} article{totalCount === 1 ? '' : 's'}
            </p>
          )}
        </header>

        {!articles.length ? (
          <div className="rounded-xl border border-border bg-card/40 px-6 py-16 text-center">
            <p className="font-heading text-lg font-semibold text-foreground">
              No articles yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon, or browse all articles.
            </p>
            <Link
              to="/articles"
              className="mt-6 inline-flex text-sm text-accent-foreground transition-colors hover:text-accent-foreground/80"
            >
              Back to articles
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {articles.map((article) => (
                <ArticleThumbCard key={article.id} article={article} />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={isFetchingNextPage}
                  className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-6 py-2.5 font-mono text-sm tracking-wide text-accent-foreground uppercase transition-colors hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isFetchingNextPage ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
    </div>
  )
}
