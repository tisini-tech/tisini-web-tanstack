import {
  createFileRoute,
  Link,
  Outlet,
  useParams,
} from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  DEFAULT_FIXTURE_TYPE,
  FIXTURE_TYPES,
  type FixtureType,
} from '@/lib/scores'

export const Route = createFileRoute('/glossary')({
  head: () => ({
    meta: [
      { title: 'Glossary | Tisini' },
      {
        name: 'description',
        content:
          'Tisini Events Definitions — consistent football, rugby, and basketball terms used across African leagues.',
      },
    ],
  }),
  component: GlossaryLayout,
})

const sports: {
  fixtype: FixtureType
  label: string
  icon: string
}[] = [
  { fixtype: 'football', label: 'Football', icon: '⚽' },
  { fixtype: 'rugby', label: 'Rugby', icon: '🏉' },
  { fixtype: 'basketball', label: 'Basketball', icon: '🏀' },
]

function GlossaryLayout() {
  const params = useParams({ strict: false }) as { fixtype?: string }
  const active = FIXTURE_TYPES.includes(params.fixtype as FixtureType)
    ? (params.fixtype as FixtureType)
    : DEFAULT_FIXTURE_TYPE

  return (
    <div className="bg-background text-foreground">
      <header className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Tisini Stats Definitions
        </h1>

        <nav
          aria-label="Sport"
          className="flex flex-wrap items-center gap-0.5 self-start sm:self-auto"
        >
          {sports.map((sport) => {
            const isActive = active === sport.fixtype
            return (
              <Link
                key={sport.fixtype}
                to="/glossary/$fixtype"
                params={{ fixtype: sport.fixtype }}
                className={cn(
                  'rounded-md px-2.5 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors sm:px-3',
                  isActive
                    ? 'text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <span aria-hidden className="mr-1.5 opacity-80">
                  {sport.icon}
                </span>
                {sport.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  )
}
