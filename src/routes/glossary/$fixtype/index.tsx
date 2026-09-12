import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { parseFixtureType } from '@/lib/scores'

export const Route = createFileRoute('/glossary/$fixtype/')({
  params: {
    parse: (params) => ({
      fixtype: parseFixtureType(params.fixtype),
    }),
  },
  component: RouteComponent,
})

const sportMeta: Record<
  string,
  { icon: string; label: string }
> = {
  football: { icon: '⚽', label: 'Football' },
  rugby: { icon: '🏉', label: 'Rugby' },
  basketball: { icon: '🏀', label: 'Basketball' },
}

function RouteComponent() {
  const { fixtype } = Route.useParams()
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
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'

      if (
        (event.key === '/' && !isTyping) ||
        ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')
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

  return (
    <div className="space-y-4">
      <label className="relative block w-full">
        <span className="sr-only">Search {meta.label} glossary terms</span>
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
            Sections and terms coming soon
          </p>
        </div>

        <div className="px-5 py-10 text-center sm:px-8">
          <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
            {query.trim()
              ? `No terms match “${query.trim()}” yet.`
              : `Glossary sections and terms for ${meta.label.toLowerCase()} will land here next.`}
          </p>
        </div>
      </section>
    </div>
  )
}
