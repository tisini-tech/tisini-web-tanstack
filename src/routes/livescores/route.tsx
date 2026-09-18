import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import LeaguesMenu from '#/components/scores/leagues/league-menu'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/livescores')({
  component: RouteComponent,
})

const sports = [
  { to: '/livescores/football', label: 'Football', icon: '⚽' },
  { to: '/livescores/rugby', label: 'Rugby', icon: '🏉' },
  { to: '/livescores/basketball', label: 'Basketball', icon: '🏀' },
] as const

function RouteComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <div className="bg-background text-foreground">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-1">
          {sports.map((sport) => {
            const active = pathname.startsWith(sport.to)
            return (
              <Link
                key={sport.to}
                to={sport.to as any}
                className={cn(
                  'rounded-lg px-3 py-2 font-heading text-sm font-semibold tracking-wide transition-colors sm:px-4 sm:text-base',
                  active
                    ? 'bg-emerald-500/15 text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground',
                )}
              >
                <span aria-hidden="true" className="mr-1.5">
                  {sport.icon}
                </span>
                {sport.label}
              </Link>
            )
          })}
        </div>

        <input
          type="search"
          placeholder="Search"
          className="hidden rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-400/40 focus:outline-none md:inline-block"
        />
      </div>

      <div className="mt-4 grid min-h-[70vh] grid-cols-12 gap-4">
        <aside className="hidden rounded-xl border border-border bg-card/40 md:col-span-3 md:block">
          <LeaguesMenu />
        </aside>

        <div className="col-span-12 rounded-xl border border-border bg-card/40 md:col-span-9">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
