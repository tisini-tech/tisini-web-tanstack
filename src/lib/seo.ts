import { resolveMediaUrl } from '#/lib/utils'

const DEFAULT_SITE_URL = 'https://tisini.africa'
const DEFAULT_OG_IMAGE = '/tisini-logo.png'

/** Public site origin for canonical + Open Graph URLs. */
export function getSiteUrl() {
  const fromEnv = process.env.SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return DEFAULT_SITE_URL
}

/** Build an absolute URL on the public site. */
export function absoluteUrl(path = '/') {
  const base = getSiteUrl()
  if (!path || path === '/') return base
  if (/^https?:\/\//i.test(path)) return path
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

/** Prefer article/media image; fall back to brand asset. Always absolute. */
export function resolveOgImage(src?: string | null) {
  return resolveMediaUrl(src) || absoluteUrl(DEFAULT_OG_IMAGE)
}
