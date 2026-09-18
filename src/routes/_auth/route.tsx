import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  const year = new Date().getFullYear()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isRegister = pathname === '/register'

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <img
        src="/auth-cover.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />

      <div className="relative z-10 flex min-h-svh flex-col px-6 py-8 md:px-10 md:py-10">
        <div className="flex shrink-0 justify-center">
          <Link to="/" className="inline-flex items-center">
            <img
              src="/tisini-logo.png"
              alt="Tisini"
              className="h-11 w-auto object-contain md:h-12 dark:invert"
            />
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 justify-center overflow-y-auto py-8 md:py-10">
          <div
            className={cn(
              'my-auto w-full rounded-2xl border border-border/60 bg-background/85 p-6 shadow-2xl backdrop-blur-md sm:p-8',
              isRegister ? 'max-w-2xl' : 'max-w-lg',
            )}
          >
            <Outlet />
          </div>
        </div>

        <p className="shrink-0 text-center text-xs text-foreground/55">
          © {year} Tisini. All rights reserved.
        </p>
      </div>
    </div>
  )
}
