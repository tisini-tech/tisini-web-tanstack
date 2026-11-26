import { SearchIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Engagement } from '#/lib/types'
import EngagementCard, { type EngagementSection } from './engagement-card'

const PAGE_SIZE = 12

export default function EngagementsList({
  engagements,
  type,
}: {
  engagements: Engagement[]
  type: EngagementSection
}) {
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(PAGE_SIZE)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return engagements
    return engagements.filter((engagement) =>
      [engagement.title, engagement.description, engagement.prize_description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [engagements, query])

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
            Other quizzes
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {visible.length} {visible.length === 1 ? 'quiz' : 'quizzes'}
            {query.trim() ? ' found' : ' available'}
          </p>
        </div>

        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Search quizzes</span>
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setShown(PAGE_SIZE)
            }}
            placeholder="Search quizzes"
            className="h-12 w-full rounded-xl border border-border bg-muted/30 pr-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-foreground">
            {query.trim()
              ? `No quizzes match “${query.trim()}”`
              : 'No other quizzes right now'}
          </p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.slice(0, shown).map((engagement) => (
              <li key={engagement.id} className="min-w-0">
                <EngagementCard engagement={engagement} type={type} />
              </li>
            ))}
          </ul>
          {shown < visible.length ? (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShown((count) => count + PAGE_SIZE)}
                className="inline-flex h-11 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                More
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  )
}
