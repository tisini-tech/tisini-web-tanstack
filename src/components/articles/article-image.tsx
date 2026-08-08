import * as React from 'react'
import { cn, resolveMediaUrl } from '@/lib/utils'

type ArticleImageProps = {
  src?: string | null
  alt?: string
  className?: string
}

export function ArticleImage({ src, alt = '', className }: ArticleImageProps) {
  const [failed, setFailed] = React.useState(false)
  const resolved = resolveMediaUrl(src)

  React.useEffect(() => {
    setFailed(false)
  }, [resolved])

  if (failed || !resolved) {
    return (
      <div
        aria-hidden={!alt}
        className={cn(
          'bg-gradient-to-br from-emerald-500/15 via-background to-sky-500/10',
          className,
        )}
      />
    )
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('object-cover transition duration-500', className)}
    />
  )
}
