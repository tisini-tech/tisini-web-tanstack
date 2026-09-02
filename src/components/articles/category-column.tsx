import type { Article } from '#/lib/types'
import { ArticleLeadCard, ArticleRowCard } from './article-cards'
import CategoryHeader from './category-header'

type ColumnProps = {
  category: string
  /** URL/API category key for View All. Defaults to `category`. */
  categorySlug?: string
  articles: Article[]
  /** Total articles to show including the lead. Default 3. */
  maxItems?: number
}

const CategoryColumn = ({
  category,
  categorySlug,
  articles,
  maxItems = 3,
}: ColumnProps) => {
  if (!articles.length) return null

  const visible = articles.slice(0, maxItems)
  const [lead, ...rows] = visible

  return (
    <div className="w-full">
      <CategoryHeader category={category} categorySlug={categorySlug} />

      <ArticleLeadCard
        article={lead}
        className="relative mb-4 h-44 sm:h-48"
      />

      {rows.length > 0 && (
        <div className="divide-y divide-border border-t border-border">
          {rows.map((article) => (
            <ArticleRowCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryColumn
