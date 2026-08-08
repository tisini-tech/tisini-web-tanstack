import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'

import appCss from '../styles.css?url'
import { SiteFooter } from '#/components/site/footer'
import { SiteHeader } from '#/components/site/header'
import { cn } from '@/lib/utils'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Tisini',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isHome = pathname === '/'

  return (
    <html lang="en" className={cn('dark', isHome && 'h-full overflow-hidden')}>
      <head>
        <HeadContent />
      </head>

      <body className={cn('min-h-screen', isHome && 'h-full overflow-hidden')}>
        <main
          className={cn(
            'flex w-full flex-col',
            isHome ? 'h-full overflow-hidden' : 'min-h-screen',
          )}
        >
          {/* Home renders its own header inside the snap layout */}
          {!isHome && <SiteHeader />}

          <div className="w-full min-w-0 flex-1">{children}</div>

          {!isHome && (
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
              <SiteFooter />
            </div>
          )}
        </main>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
