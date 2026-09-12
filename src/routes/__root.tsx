import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import appCss from '../styles.css?url'
import { SiteFooter } from '#/components/site/footer'
import { SiteHeader } from '#/components/site/header'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '#/providers/theme-provider'

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
  // Overlay / OBS-style pages — no site chrome
  const isStream = pathname.startsWith('/streams')
  const hideChrome = isHome || isStream
  const lockViewport = isHome || isStream

  // Don't set className on <html> via React — that overwrites theme dark/light classes.
  // Toggle layout classes with classList instead.
  useEffect(() => {
    const root = document.documentElement
    if (lockViewport) {
      root.classList.add('h-full', 'overflow-hidden')
    } else {
      root.classList.remove('h-full', 'overflow-hidden')
    }
  }, [lockViewport])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body
        className={cn('min-h-screen', lockViewport && 'h-full overflow-hidden')}
      >
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <main
            className={cn(
              'flex w-full flex-col',
              lockViewport ? 'h-full overflow-hidden' : 'min-h-screen',
            )}
          >
            {/* Home / streams render without the global site chrome */}
            {!hideChrome && <SiteHeader />}

            <div className="flex w-full min-w-0 flex-1 flex-col">
              {children}
            </div>

            {!hideChrome && (
              <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
                <SiteFooter />
              </div>
            )}
          </main>

          {!isStream && (
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
          )}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
