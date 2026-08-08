import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { cn, formatDate } from '@/lib/utils'
import type { Article } from '#/lib/types'
import { articlesQueryOptions } from '#/data/articles'

function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = React.useState(false)

  if (failed || !src) {
    return (
      <div className="h-full w-full bg-gradient-to-br from-primary/15 via-background to-background" />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  )
}

function ArticleCard({
  article,
  className,
}: {
  article: Article
  className?: string
}) {
  const date = formatDate(article.published_at ?? article.created_at)
  const author = article.author?.username ?? 'Tisini Team'
  const badge = article.category?.name

  return (
    <Link
      to={'/articles/$slug' as any}
      params={{ slug: article.slug } as any}
      className={cn(
        'group relative block shrink-0 overflow-hidden rounded-xl border border-primary/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        className,
      )}
    >
      <ArticleImage src={article.featured_image} alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      {badge && (
        <div className="absolute top-3 right-3 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
          {badge}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        {date && (
          <p className="font-mono text-[11px] tracking-wide text-emerald-400/90">
            {date}
          </p>
        )}
        <h3 className="mt-2 text-sm leading-snug font-bold text-white sm:text-base">
          {article.title}
        </h3>
        <p className="mt-1 text-xs text-white/60">{author}</p>
      </div>
    </Link>
  )
}

function ArticlesSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="h-9 w-56 animate-pulse rounded bg-white/5" />
        <div className="mt-3 h-5 w-80 max-w-full animate-pulse rounded bg-white/5" />
      </div>
      <div className="mb-4 aspect-[21/9] w-full animate-pulse rounded-xl bg-white/5 sm:aspect-[2.5/1]" />
      <div className="flex gap-4 overflow-hidden pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-[4/5] w-[85vw] shrink-0 animate-pulse rounded-xl bg-white/5 sm:w-[300px] md:w-[340px]"
          />
        ))}
      </div>
    </div>
  )
}

function ArticlesContent() {
  const { data } = useSuspenseQuery(articlesQueryOptions())
  const articles = data.results

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [checkScroll, articles])

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  const header = (
    <div className="mb-8 flex items-end justify-between">
      <div>
        <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Latest Articles
        </h2>
        <p className="mt-2 text-muted-foreground">
          Match reports, analysis, and coverage from across African football.
        </p>
      </div>
      <Link
        to={'/articles' as any}
        className="hidden font-mono text-sm font-medium text-primary hover:text-primary/80 sm:block"
      >
        View all →
      </Link>
    </div>
  )

  if (articles.length === 0) {
    return (
      <div className="w-full">
        {header}
        <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-10 text-center text-muted-foreground">
          No articles yet — check back soon.
        </div>
      </div>
    )
  }

  const featured = articles[0]
  const grid = articles.slice(1)

  return (
    <div className="w-full">
      {header}

      <ArticleCard
        article={featured}
        className="mb-4 aspect-[21/9] w-full sm:aspect-[2.5/1]"
      />

      {grid.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => scrollBy('left')}
            aria-label="Scroll to previous articles"
            className={cn(
              'absolute top-1/2 left-2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-opacity',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
              canScrollLeft ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollBy('right')}
            aria-label="Scroll to more articles"
            className={cn(
              'absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-opacity',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
              canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div
            ref={scrollRef}
            role="region"
            aria-label="More articles, scrollable"
            tabIndex={0}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pt-2 pb-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {grid.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                className="aspect-[4/5] w-[85vw] snap-start sm:w-[300px] md:w-[340px]"
              />
            ))}

            <Link
              to={'/articles' as any}
              className="flex aspect-[4/5] w-[85vw] shrink-0 snap-start items-center justify-center rounded-xl border border-dashed border-primary/20 bg-primary/5 transition-colors hover:bg-primary/10 sm:w-[200px]"
            >
              <div className="text-center">
                <p className="font-mono text-lg font-semibold text-primary">
                  View All
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.count}+ articles
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-4 text-center sm:hidden">
        <Link
          to={'/articles' as any}
          className="font-mono text-sm font-medium text-primary"
        >
          View all articles →
        </Link>
      </div>
    </div>
  )
}

export function ArticlesSection() {
  return (
    <React.Suspense fallback={<ArticlesSkeleton />}>
      <ArticlesContent />
    </React.Suspense>
  )
}
