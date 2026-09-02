import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'
import type { Article } from '#/lib/types'
import { formatDate } from '@/lib/utils'
import { ArticleImage } from './article-image'

type FeaturedProps = {
  article: Article
  recentPosts: Article[]
}

const FeaturedSection = ({ article, recentPosts }: FeaturedProps) => {
  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 pt-20 pb-8 sm:px-6 md:h-[min(70vh,720px)] md:flex-row">
      <FeaturedArticle article={article} />

      <div className="flex flex-1 flex-col gap-3 overflow-hidden">
        <div className="relative flex min-h-0 flex-1 flex-col gap-3 md:flex-row">
          <ArticleCard article={recentPosts[0]} />
          <ArticleCard article={recentPosts[1]} />
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col gap-3 md:flex-row">
          <ArticleCard article={recentPosts[2]} />
          <ArticleCard article={recentPosts[3]} />
        </div>
      </div>
    </section>
  )
}

const FeaturedArticle = ({ article }: { article: Article }) => {
  const date = formatDate(article.published_at || article.created_at)

  return (
    <div className="min-h-[280px] flex-1 overflow-hidden rounded-xl border border-border md:min-h-0">
      <Link
        to={`/articles/${article.slug}` as any}
        className="group relative flex h-full min-h-[280px] md:min-h-full"
      >
        <ArticleImage
          src={article.featured_image}
          alt={article.title}
          className="absolute inset-0 h-full w-full group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute top-4 right-4 flex items-center justify-center rounded-md bg-emerald-500/90 px-2 py-1 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]">
          <Zap className="h-4 w-4" />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          {date && (
            <p className="mb-2 text-sm text-muted-foreground">{date}</p>
          )}
          <h3 className="font-heading line-clamp-3 text-xl font-bold text-foreground transition-colors group-hover:text-accent-foreground sm:text-2xl">
            {article.title}
          </h3>
        </div>
      </Link>
    </div>
  )
}

const ArticleCard = ({ article }: { article?: Article }) => {
  if (!article) {
    return (
      <div className="min-h-[140px] flex-1 rounded-xl border border-dashed border-border bg-muted/20" />
    )
  }

  const date = formatDate(article.published_at || article.created_at)

  return (
    <div className="min-h-[140px] flex-1 overflow-hidden rounded-xl border border-border">
      <Link
        to={`/articles/${article.slug}` as any}
        className="group relative flex h-full min-h-[140px]"
      >
        <ArticleImage
          src={article.featured_image}
          alt={article.title}
          className="absolute inset-0 h-full w-full group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
          {date && (
            <p className="mb-1 text-xs text-muted-foreground">{date}</p>
          )}
          <h3 className="font-heading line-clamp-3 text-sm font-bold text-foreground transition-colors group-hover:text-accent-foreground">
            {article.title}
          </h3>
        </div>
      </Link>
    </div>
  )
}

export default FeaturedSection
