import { Link } from '@tanstack/react-router'
import type { Article } from '#/lib/types'
import { cn, formatDate } from '@/lib/utils'
import { ArticleImage } from './article-image'

export function ArticleLeadCard({
  article,
  className,
  imageClassName,
}: {
  article: Article
  className?: string
  imageClassName?: string
}) {
  return (
    <Link
      to={`/articles/${article.slug}` as any}
      className={cn(
        'group relative block overflow-hidden rounded-xl border border-white/10',
        className,
      )}
    >
      <ArticleImage
        src={article.featured_image}
        alt={article.title}
        className={cn(
          'absolute inset-0 h-full w-full group-hover:scale-105',
          imageClassName,
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="mb-1 text-xs text-muted-foreground">
          {formatDate(article.published_at || article.created_at)}
        </p>
        <h3 className="font-heading line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-300 sm:text-base">
          {article.title}
        </h3>
      </div>
    </Link>
  )
}

export function ArticleRowCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.slug}` as any}
      className="group flex items-center gap-3 py-3.5 sm:gap-4"
    >
      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 sm:h-20 sm:w-28">
        <ArticleImage
          src={article.featured_image}
          alt={article.title}
          className="h-full w-full group-hover:scale-105"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">
          {formatDate(article.published_at || article.created_at)}
        </p>
        <h3 className="font-heading mt-1 line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-300">
          {article.title}
        </h3>
      </div>
    </Link>
  )
}

export function ArticleThumbCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/articles/${article.slug}` as any}
      className="group flex flex-col gap-2"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-lg border border-white/10 sm:aspect-[16/10]">
        <ArticleImage
          src={article.featured_image}
          alt={article.title}
          className="h-full w-full group-hover:scale-105"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {formatDate(article.published_at || article.created_at)}
      </p>

      <h3 className="font-heading line-clamp-3 text-xs font-semibold text-foreground transition-colors group-hover:text-emerald-300 sm:text-sm">
        {article.title}
      </h3>
    </Link>
  )
}
