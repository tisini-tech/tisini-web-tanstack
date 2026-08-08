// src/components/landing/blogs.tsx
import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

interface Story {
  id: string
  title: string
  author: string
  date: string
  image: string
  href: string
  featured?: boolean
  badge?: string
}

// Adjust this to whatever your endpoint actually returns. Keeping the
// mapping in one place means the rest of the file never has to know
// what the API's field names look like.
function mapApiArticleToStory(raw: any): Story {
  return {
    id: String(raw.id),
    title: raw.title,
    author: raw.author?.name ?? raw.author ?? 'Tisini Team',
    date: new Date(raw.publishedAt ?? raw.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    image: raw.coverImage ?? raw.image ?? '',
    href: `/blog/${raw.slug ?? raw.id}`,
    featured: Boolean(raw.featured),
    badge: raw.featured ? 'Trending' : undefined,
  }
}

function useArticles(endpoint: string) {
  const [stories, setStories] = React.useState<Story[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(endpoint)
        if (!res.ok) throw new Error(`Request failed with ${res.status}`)
        const data = await res.json()
        const list = Array.isArray(data) ? data : data.articles
        if (!cancelled) setStories(list.map(mapApiArticleToStory))
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : 'Failed to load stories',
          )
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [endpoint])

  return { stories, error }
}

function dispatchTag(index: number) {
  return `DISPATCH ${String(index + 1).padStart(3, '0')}`
}

function StoryImage({ src, alt }: { src: string; alt: string }) {
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

function StoryCard({
  story,
  index,
  className,
}: {
  story: Story
  index: number
  className?: string
}) {
  return (
    <Link
      to={story.href}
      className={cn(
        'group relative block shrink-0 overflow-hidden rounded-xl border border-primary/10',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        className,
      )}
    >
      <StoryImage src={story.image} alt="" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      {story.badge && (
        <div className="absolute right-3 top-3 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg">
          {story.badge}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-mono text-[11px] tracking-wide text-emerald-400/90">
          {dispatchTag(index)} — {story.date}
        </p>
        <h3 className="mt-2 text-sm font-bold leading-snug text-white sm:text-base">
          {story.title}
        </h3>
        <p className="mt-1 text-xs text-white/60">{story.author}</p>
      </div>
    </Link>
  )
}

// Same aspect ratios as the real cards, so the row doesn't jump when data arrives.
function StorySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-white/5', className)} />
  )
}

export function ArticlesSection({
  endpoint = '/api/articles',
}: {
  endpoint?: string
}) {
  const { stories, error } = useArticles(endpoint)

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
  }, [checkScroll, stories])

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
          Latest Stories
        </h2>
        <p className="mt-2 text-muted-foreground">
          Sports analysis, data insights, and African football coverage.
        </p>
      </div>
      <a
        href="/articles"
        className="hidden font-mono text-sm font-medium text-primary hover:text-primary/80 sm:block"
      >
        View all →
      </a>
    </div>
  )

  if (error) {
    return (
      <div className="w-full">
        {header}
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-400">
          Couldn't load stories right now. {error}
        </div>
      </div>
    )
  }

  if (!stories) {
    return (
      <div className="w-full">
        {header}
        <StorySkeleton className="mb-4 aspect-[21/9] w-full sm:aspect-[2.5/1]" />
        <div className="flex gap-4 overflow-hidden pt-2">
          {[1, 2, 3, 4].map((i) => (
            <StorySkeleton
              key={i}
              className="aspect-[4/5] w-[85vw] shrink-0 sm:w-[300px] md:w-[340px]"
            />
          ))}
        </div>
      </div>
    )
  }

  const featured = stories.find((s) => s.featured) ?? stories[0]
  const grid = stories.filter((s) => s.id !== featured.id)

  if (stories.length === 0) {
    return (
      <div className="w-full">
        {header}
        <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-10 text-center text-muted-foreground">
          No stories yet — check back soon.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {header}

      <StoryCard
        story={featured}
        index={0}
        className="mb-4 aspect-[21/9] w-full sm:aspect-[2.5/1]"
      />

      <div className="relative">
        <button
          onClick={() => scrollBy('left')}
          aria-label="Scroll to previous stories"
          className={cn(
            'absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-opacity',
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
          onClick={() => scrollBy('right')}
          aria-label="Scroll to more stories"
          className={cn(
            'absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg backdrop-blur-sm transition-opacity',
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
          aria-label="More stories, scrollable"
          tabIndex={0}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 pt-2 [-webkit-overflow-scrolling:touch] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 [&::-webkit-scrollbar]:hidden"
        >
          {grid.map((story, i) => (
            <StoryCard
              key={story.id}
              story={story}
              index={i + 1}
              className="aspect-[4/5] w-[85vw] snap-start sm:w-[300px] md:w-[340px]"
            />
          ))}

          <a
            href="/articles"
            className="flex w-[85vw] shrink-0 snap-start items-center justify-center rounded-xl border border-dashed border-primary/20 bg-primary/5 transition-colors hover:bg-primary/10 sm:w-[200px] aspect-[4/5]"
          >
            <div className="text-center">
              <p className="font-mono text-lg font-semibold text-primary">
                View All
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stories.length}+ stories
              </p>
            </div>
          </a>
        </div>
      </div>

      <div className="mt-4 text-center sm:hidden">
        <a
          href="/articles"
          className="font-mono text-sm font-medium text-primary"
        >
          View all stories →
        </a>
      </div>
    </div>
  )
}
