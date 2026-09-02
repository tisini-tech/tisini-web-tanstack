import { cn, resolveMediaUrl } from '@/lib/utils'

const logoFrameClass =
  'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted/70 p-1 ring-1 ring-border/80 dark:bg-white/10 dark:ring-white/15'

export function TeamLogo({
  src,
  alt,
  className,
  fallbackSrc,
}: {
  src?: string | null
  alt: string
  className?: string
  fallbackSrc?: string
}) {
  const resolved = resolveMediaUrl(src)
  const sizeClass = className ?? 'h-10 w-10'

  if (!resolved) {
    if (fallbackSrc) {
      return (
        <div className={cn(logoFrameClass, sizeClass)}>
          <img
            src={fallbackSrc}
            alt={alt}
            decoding="async"
            className="h-full w-full object-contain"
          />
        </div>
      )
    }

    return (
      <div
        aria-hidden={!alt}
        className={cn(
          'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-500/20 via-background to-sky-500/15 text-xs font-bold text-accent-foreground/80 ring-1 ring-border/70',
          sizeClass,
        )}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={cn(logoFrameClass, sizeClass)}>
      <img
        src={resolved}
        alt={alt}
        referrerPolicy="no-referrer"
        decoding="async"
        className="h-full w-full object-contain"
      />
    </div>
  )
}
