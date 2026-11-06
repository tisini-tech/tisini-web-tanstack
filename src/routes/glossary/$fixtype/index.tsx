
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { parseFixtureType } from '@/lib/scores'
import { metricsQueryOptions } from '#/data/metrics'
import { GlossaryContent } from '#/components/glossary/glossary-content'

export const Route = createFileRoute('/glossary/$fixtype/')({
  params: {
    parse: (params) => ({
      fixtype: parseFixtureType(params.fixtype),
    }),
  },

  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      metricsQueryOptions(params.fixtype),
    ),

  component: RouteComponent,
})

const sportMeta: Record<string, { icon: string; label: string }> = {
  football: { icon: '⚽', label: 'Football' },
  rugby: { icon: '🏉', label: 'Rugby' },
  basketball: { icon: '🏀', label: 'Basketball' },
}

function matchesSearch(query: string, ...values: (string | null)[]) {
  if (!query) return true

  return values.some((value) =>
    value?.toLowerCase().includes(query),
  )
}

function RouteComponent() {
  const { fixtype } = Route.useParams()

  const meta = sportMeta[fixtype] ?? {
    icon: '📋',
    label: fixtype,
  }

  const { data: metrics } = useSuspenseQuery(
    metricsQueryOptions(fixtype),
  )

  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuery('')
  }, [fixtype])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName

      const isTyping =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT'

      if (
        (event.key === '/' && !isTyping) ||
        ((event.metaKey || event.ctrlKey) &&
          event.key.toLowerCase() === 'k')
      ) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const isMac =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPad|iPod/.test(navigator.platform)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredMetrics = metrics.flatMap((metric) => {
    const metricMatches = matchesSearch(
      normalizedQuery,
      metric.name,
      metric.description,
    )

    const details = metric.details.filter(
      (detail) =>
        metricMatches ||
        matchesSearch(
          normalizedQuery,
          detail.name,
          detail.description,
        ),
    )

    const subDetails = metric.sub_details.filter(
      (subDetail) =>
        metricMatches ||
        matchesSearch(
          normalizedQuery,
          subDetail.name,
          subDetail.description,
        ),
    )

    if (
      !metricMatches &&
      details.length === 0 &&
      subDetails.length === 0
    ) {
      return []
    }

    return [{ metric, details, subDetails }]
  })

  return (
    <div className="space-y-4">
      <label className="relative block w-full">
        <span className="sr-only">
          Search {meta.label} glossary terms
        </span>

        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />

        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${meta.label.toLowerCase()} terms… (press / to focus)`}
          className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pr-16 pl-10 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none"
        />

        <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-border bg-background/80 px-1.5 py-0.5 font-mono text-[10px] tracking-wide text-muted-foreground sm:inline-block">
          {isMac ? '⌘K' : 'Ctrl K'}
        </kbd>
      </label>

      <section className="rounded-2xl border border-border bg-card/40">
        <div className="border-b border-border px-5 py-5 text-center sm:px-8 sm:py-6">
          <p className="font-heading text-xl font-bold tracking-wide text-foreground uppercase sm:text-2xl">
            <span aria-hidden className="mr-2">
              {meta.icon}
            </span>
            {meta.label}
          </p>

          <div
            aria-hidden
            className="mx-auto mt-2 h-0.5 w-10 rounded-full bg-emerald-400/70"
          />

          <p className="mt-2 font-mono text-xs tracking-wide text-muted-foreground">
            {filteredMetrics.length} glossary terms
          </p>
        </div>

        <div className="space-y-3 px-5 py-6 sm:px-8">
          {filteredMetrics.length > 0 ? (
            filteredMetrics.map(({ metric, details, subDetails }) => (
              <details
                key={metric.id}
                className="group rounded-xl border border-border bg-card"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-semibold">
                  <span>{metric.name}</span>

                  <span className="text-muted-foreground transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>

                <div className="space-y-6 border-t border-border p-4">
                  <GlossaryContent
                    name={metric.name}
                    description={metric.description}
                    imageUrl={metric.image_url}
                    videoUrl={metric.video_url}
                  />

                  {details.length > 0 && (
                    <section className="space-y-4">
                      <h3 className="font-semibold">Details</h3>

                      {details.map((detail) => (
                        <div
                          key={detail.id}
                          className="rounded-lg bg-muted/40 p-4"
                        >
                          <GlossaryContent
                            name={detail.name}
                            description={detail.description}
                            imageUrl={detail.image_url}
                            videoUrl={detail.video_url}
                          />
                        </div>
                      ))}
                    </section>
                  )}

                  {subDetails.length > 0 && (
                    <section className="space-y-4">
                      <h3 className="font-semibold">Sub-details</h3>

                      {subDetails.map((subDetail) => (
                        <div
                          key={subDetail.id}
                          className="rounded-lg bg-muted/40 p-4"
                        >
                          <GlossaryContent
                            name={subDetail.name}
                            description={subDetail.description}
                            imageUrl={subDetail.image_url}
                            videoUrl={subDetail.video_url}
                          />
                        </div>
                      ))}
                    </section>
                  )}
                </div>
              </details>
            ))
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {normalizedQuery
                ? `No terms match "${query.trim()}".`
                : `No glossary terms available for ${meta.label.toLowerCase()}.`}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
