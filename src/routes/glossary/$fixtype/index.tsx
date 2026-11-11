
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { GlossaryContent } from '@/components/glossary/glossary-content'
import { metricsQueryOptions } from '@/data/metrics'
import { parseFixtureType } from '@/lib/scores'
import type {
  Metric,
  MetricDetail,
  MetricSubDetail,
} from '@/lib/types'

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

const sportMeta: Record<
  string,
  { icon: string; label: string }
> = {
  football: { icon: '⚽', label: 'Football' },
  rugby: { icon: '🏉', label: 'Rugby' },
  basketball: { icon: '🏀', label: 'Basketball' },
  hockey: { icon: '🏑', label: 'Hockey' },
  handball: { icon: '🤾‍♂️', label: 'Handball' },
}

function matchesSearch(
  item: Metric | MetricDetail | MetricSubDetail,
  search: string,
) {
  const term = search.toLowerCase()

  return (
    item.name.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term)
  )
}

function RouteComponent() {
  const { fixtype } = Route.useParams()

  const { data: metrics } = useSuspenseQuery(
    metricsQueryOptions(fixtype),
  )

  const meta = sportMeta[fixtype] ?? {
    icon: '📋',
    label: fixtype,
  }

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

  const searchTerm = query.trim()

  const filteredMetrics = metrics
    .map((metric) => {
      if (!searchTerm) {
        return {
          ...metric,
          filteredDetails: metric.details,
          filteredSubDetails: metric.sub_details,
        }
      }

      const metricMatches = matchesSearch(metric, searchTerm)

      const filteredDetails = metric.details.filter((detail) =>
        matchesSearch(detail, searchTerm),
      )

      const filteredSubDetails = metric.sub_details.filter(
        (subDetail) => matchesSearch(subDetail, searchTerm),
      )

      if (
        !metricMatches &&
        filteredDetails.length === 0 &&
        filteredSubDetails.length === 0
      ) {
        return null
      }

      return {
        ...metric,
        filteredDetails: metricMatches
          ? metric.details
          : filteredDetails,
        filteredSubDetails: metricMatches
          ? metric.sub_details
          : filteredSubDetails,
      }
    })
    .filter((metric) => metric !== null)

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
            {searchTerm
              ? `${filteredMetrics.length} matching metrics`
              : `${metrics.length} metrics`}
          </p>
        </div>

        <div className="space-y-3 px-4 py-5 sm:px-6">
          {filteredMetrics.length > 0 ? (
            filteredMetrics.map((metric) => (
              <details
                key={metric.id}
                className="group rounded-xl border border-border bg-background/50"
              >
                <summary className="cursor-pointer list-none px-4 py-4 font-semibold text-foreground marker:hidden">
                  <div className="flex items-center justify-between gap-3">
                    <span>{metric.name}</span>

                    <span className="text-muted-foreground transition-transform group-open:rotate-180">
                      ▼
                    </span>
                  </div>
                </summary>

                <div className="space-y-6 border-t border-border px-4 py-5">
                  <GlossaryContent
                    name={metric.name}
                    description={metric.description}
                    imageUrl={metric.image_url}
                    videoUrl={metric.video_url}
                  />

                  {metric.filteredDetails.length > 0 && (
                    <section className="space-y-4">
                      <h4 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Details
                      </h4>

                      {metric.filteredDetails.map((detail) => (
                        <GlossaryContent
                          key={detail.id}
                          name={detail.name}
                          description={detail.description}
                          imageUrl={detail.image_url}
                          videoUrl={detail.video_url}
                        />
                      ))}
                    </section>
                  )}

                  {metric.filteredSubDetails.length > 0 && (
                    <section className="space-y-4">
                      <h4 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Sub-details
                      </h4>

                      {metric.filteredSubDetails.map((subDetail) => (
                        <GlossaryContent
                          key={subDetail.id}
                          name={subDetail.name}
                          description={subDetail.description}
                          imageUrl={subDetail.image_url}
                          videoUrl={subDetail.video_url}
                        />
                      ))}
                    </section>
                  )}
                </div>
              </details>
            ))
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {searchTerm
                  ? `No terms match "${searchTerm}".`
                  : `No metrics available for ${meta.label.toLowerCase()}.`}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
