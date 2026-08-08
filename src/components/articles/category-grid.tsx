import type { Article } from '#/lib/types'
import { ArticleLeadCard, ArticleThumbCard } from './article-cards'
import CategoryHeader from './category-header'

type GridProps = {
  category: string
  categorySlug?: string
  articles: Article[]
}

const CategoryGrid = ({ category, categorySlug, articles }: GridProps) => {
  if (!articles.length) return null

  const [lead, ...rest] = articles
  const gridArticles = rest.slice(0, 4)

  return (
    <div className="w-full">
      <CategoryHeader category={category} categorySlug={categorySlug} />

      <ArticleLeadCard article={lead} className="relative mb-5 h-48" />

      {gridArticles.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            {gridArticles[0] && (
              <ArticleThumbCard article={gridArticles[0]} />
            )}
            {gridArticles[1] && (
              <ArticleThumbCard article={gridArticles[1]} />
            )}
          </div>

          {(gridArticles[2] || gridArticles[3]) && (
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              {gridArticles[2] && (
                <ArticleThumbCard article={gridArticles[2]} />
              )}
              {gridArticles[3] && (
                <ArticleThumbCard article={gridArticles[3]} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryGrid
