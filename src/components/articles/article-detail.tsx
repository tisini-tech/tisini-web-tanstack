import DOMPurify from 'isomorphic-dompurify'
import { Link } from '@tanstack/react-router'
import type { Article } from '#/lib/types'
import { formatDate } from '@/lib/utils'
import { ArticleImage } from './article-image'

function sanitizeArticleHtml(html: string) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  })
}

export default function ArticleDetail({ article }: { article: Article }) {
  const date = formatDate(article.published_at || article.created_at)
  const author = article.author?.username
  const category = article.category
  const bodyHtml = article.content ? sanitizeArticleHtml(article.content) : ''

  return (
    <article className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[800px] px-4 pt-24 pb-20 sm:px-6">
        <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
          <Link
            to="/articles"
            className="transition-colors hover:text-accent-foreground"
          >
            Articles
          </Link>
          {category?.name && (
            <>
              <span className="text-white/20">/</span>
              <Link
                to="/articles/categories/$categorySlug"
                params={{
                  categorySlug: category.slug || category.name,
                }}
                className="transition-colors hover:text-accent-foreground"
              >
                {category.name}
              </Link>
            </>
          )}
        </nav>

        {category?.name && (
          <Link
            to="/articles/categories/$categorySlug"
            params={{
              categorySlug: category.slug || category.name,
            }}
            className="font-mono text-xs tracking-[0.2em] text-emerald-400/90 uppercase transition-colors hover:text-accent-foreground"
          >
            {category.name}
          </Link>
        )}

        <h1 className="font-heading mt-3 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          {article.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-wide text-muted-foreground">
          {author && <span>{author}</span>}
          {author && date && <span className="text-white/20">·</span>}
          {date && <time dateTime={article.published_at || article.created_at}>{date}</time>}
          {article.access_type && (
            <>
              <span className="text-white/20">·</span>
              <span className="text-emerald-400/80">{article.access_type}</span>
            </>
          )}
        </div>

        {article.featured_image && (
          <div className="mt-8 overflow-hidden rounded-xl border border-border">
            <ArticleImage
              src={article.featured_image}
              alt={article.title}
              className="aspect-[16/9] h-auto w-full"
            />
          </div>
        )}

        {article.excerpt && (
          <p className="mt-8 border-l-2 border-emerald-400/60 pl-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {article.excerpt}
          </p>
        )}

        {bodyHtml ? (
          <div
            className="article-body mt-10"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <p className="mt-10 text-muted-foreground">
            This article has no content yet.
          </p>
        )}

        {article.keywords && article.keywords.length > 0 && (
          <ul className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8">
            {article.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-md border border-border bg-muted/30 px-2.5 py-1 font-mono text-[11px] tracking-wide text-muted-foreground uppercase"
              >
                {keyword}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
