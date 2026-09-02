import { Link } from '@tanstack/react-router'
import type { Article } from '#/lib/types'
import { cn, formatDate } from '@/lib/utils'
import CategoryHeader from './category-header'

/** Compact text list — for secondary categories like Stats. */
export function CategoryList({
  category,
  articles,
  maxItems = 6,
  columns = 1,
}: {
  category: string
  articles: Article[]
  maxItems?: number
  columns?: 1 | 2
}) {
  if (!articles.length) return null

  const items = articles.slice(0, maxItems)

  return (
    <div className="w-full">
      <CategoryHeader category={category} />
      <ul
        className={cn(
          'border-t border-border',
          columns === 2
            ? 'grid gap-x-8 sm:grid-cols-2'
            : 'divide-y divide-border',
        )}
      >
        {items.map((article) => (
          <li
            key={article.id}
            className={columns === 2 ? 'border-t border-border' : undefined}
          >
            <Link
              to={`/articles/${article.slug}` as any}
              className="group flex items-baseline justify-between gap-4 py-3"
            >
              <h3 className="font-heading line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-accent-foreground">
                {article.title}
              </h3>
              <time className="shrink-0 text-xs text-muted-foreground">
                {formatDate(article.published_at || article.created_at)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
