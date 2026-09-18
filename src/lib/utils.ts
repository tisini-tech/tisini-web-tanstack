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

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:'))
    return trimmed
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

export function formatE164Phone(
  countryCode: string,
  localPhone: string,
): string {
  const code = countryCode.trim().startsWith('+')
    ? countryCode.trim()
    : `+${countryCode.trim()}`
  const digits = localPhone.trim().replace(/\D/g, '').replace(/^0+/, '')
  return `${code}${digits}`
}

export function formatApiError(error: unknown, fallback: string): string {
  if (!error || typeof error !== 'object') return fallback

  const body = error as {
    detail?: unknown
    message?: unknown
    error?: unknown
  }

  if (typeof body.detail === 'string') return body.detail
  if (typeof body.message === 'string') return body.message
  if (typeof body.error === 'string') return body.error

  // Django/DRF field errors: { field: ["msg"] } or detail: [{ msg, loc }]
  if (Array.isArray(body.detail)) {
    const parts = body.detail
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'msg' in item) {
          return String((item as { msg: unknown }).msg)
        }
        return null
      })
      .filter(Boolean)
    if (parts.length) return parts.join(' ')
  }

  const fieldMessages = Object.entries(body)
    .flatMap(([key, value]) => {
      if (key === 'detail' || key === 'message' || key === 'error') return []
      if (typeof value === 'string') return [`${key}: ${value}`]
      if (Array.isArray(value)) return value.map((v) => `${key}: ${String(v)}`)
      return []
    })
    .filter(Boolean)

  if (fieldMessages.length) return fieldMessages.join(' ')

  return fallback
}
