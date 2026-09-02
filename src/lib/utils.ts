import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Returns a usable image URL, or '' when the value is not a valid media path. */
export function resolveMediaUrl(url?: string | null) {
  if (!url) return ''
  const trimmed = url.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`

  // S3 / CDN host without protocol, e.g. bucket.s3.region.amazonaws.com/key
  if (
    /^[a-z0-9.-]+\.amazonaws\.com/i.test(trimmed) ||
    /\.s3\.[a-z0-9-]+\.amazonaws\.com/i.test(trimmed)
  ) {
    return `https://${trimmed.replace(/^\/+/, '')}`
  }

  // Relative paths or filenames from the main API
  if (
    trimmed.startsWith('/') ||
    trimmed.includes('/media/') ||
    /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(trimmed)
  ) {
    const origin = 'https://manage.tisini.africa'
    return `${origin}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`
  }

  return ''
}
