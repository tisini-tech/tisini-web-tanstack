import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'

/** GA4 measurement ID (gtag.js). */
export const GA_MEASUREMENT_ID = 'G-VS6ZV9GNW1'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

function ensureGtag() {
  if (typeof window === 'undefined') return false
  if (typeof window.gtag === 'function') return true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`,
  )
  if (!existing) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
  }

  return true
}

/**
 * Loads gtag.js and sends a page_view on each client navigation.
 * No-op in development so localhost traffic stays out of the property.
 */
export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const search = useRouterState({ select: (s) => s.location.searchStr })

  useEffect(() => {
    if (import.meta.env.DEV) return
    if (!ensureGtag()) return

    window.gtag('event', 'page_view', {
      page_path: `${pathname}${search}`,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [pathname, search])

  return null
}
