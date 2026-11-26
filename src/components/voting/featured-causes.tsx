import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ImageIcon,
} from 'lucide-react'

import type { VoteCause } from '#/lib/types'
import { cn, resolveMediaUrl } from '#/lib/utils'
import {
  formatVoteDateRange,
  getVoteStatus,
} from '#/components/voting/voting-causes'

const AUTOPLAY_MS = 6500

export default function FeaturedCauses({ causes }: { causes: VoteCause[] }) {
  const multiple = causes.length > 1
  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_MS,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  )
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: multiple, align: 'start', watchDrag: multiple },
    multiple ? [autoplay.current] : [],
  )
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const sync = () => setSelected(emblaApi.selectedScrollSnap())
    emblaApi.on('select', sync)
    emblaApi.on('reInit', sync)
    sync()
    return () => {
      emblaApi.off('select', sync)
      emblaApi.off('reInit', sync)
    }
  }, [emblaApi])

  useEffect(() => {
    const plugin = emblaApi?.plugins()?.autoplay
    if (!plugin) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      if (media.matches) plugin.stop()
      else plugin.play()
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [emblaApi])

  if (causes.length === 0) return null

  return (
    <section
      className="mx-auto max-w-5xl"
      aria-roledescription="carousel"
      aria-label="Featured votes"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {causes.map((cause, index) => (
            <div
              key={cause.id}
              className="min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${causes.length}`}
              aria-hidden={multiple && index !== selected ? true : undefined}
              inert={multiple && index !== selected ? true : undefined}
            >
              <FeaturedCause cause={cause} />
            </div>
          ))}
        </div>
      </div>

      {multiple ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeftIcon className="size-4" aria-hidden />
          </button>
          <div className="flex items-center gap-1.5">
            {causes.map((cause, index) => (
              <button
                key={cause.id}
                type="button"
                aria-label={`Show ${cause.reason}`}
                aria-current={index === selected ? 'true' : undefined}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  index === selected
                    ? 'w-8 bg-emerald-400'
                    : 'w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
          >
            <ChevronRightIcon className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </section>
  )
}

function FeaturedCause({ cause }: { cause: VoteCause }) {
  const status = getVoteStatus(cause)
  const countdown = useCountdown(
    status === 'ended'
      ? null
      : status === 'upcoming'
        ? cause.date_from
        : cause.date_to,
  )
  const eyebrow =
    status === 'open' ? 'Open now' : status === 'upcoming' ? 'Coming up' : 'Closed'
  const clockLabel = status === 'open' ? 'Closes in' : 'Starts in'
  const action = status === 'open' ? 'Vote' : status === 'ended' ? 'Results' : 'View'

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#10182c] text-white shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)]">
      <div
        className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-emerald-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 -bottom-20 size-64 rounded-full bg-sky-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative grid items-center gap-1 md:grid-cols-[minmax(16rem,24rem)_minmax(0,1fr)]">
        <div className="p-3 sm:p-4 md:py-5 md:pr-1 md:pl-5">
          <Poster src={cause.image_url} />
        </div>

        <div className="flex flex-col items-center justify-center gap-5 px-5 pt-1 pb-6 text-center sm:px-8 sm:pb-8 md:py-8 md:pr-10 md:pl-6">
          <div>
            <p className="text-[0.68rem] font-bold tracking-[0.22em] text-emerald-300 uppercase">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-[1.05] font-bold tracking-tight text-balance sm:text-4xl">
              <CauseLink cause={cause} target="detail">
                {cause.reason}
              </CauseLink>
            </h2>
          </div>

          {countdown ? (
            <div>
              <p className="mb-2 inline-flex items-center gap-1.5 text-[0.68rem] font-bold tracking-[0.18em] text-white/55 uppercase">
                <ClockIcon className="size-3.5" aria-hidden />
                {clockLabel}
              </p>
              <Countdown units={countdown} label={clockLabel} />
            </div>
          ) : (
            <p className="text-sm text-white/60">{formatVoteDateRange(cause)}</p>
          )}

          <CauseLink
            cause={cause}
            target={status === 'upcoming' ? 'detail' : 'vote'}
            className={cn(
              'inline-flex h-12 w-fit items-center gap-2 rounded-full px-6 text-sm font-bold tracking-wide uppercase transition-colors',
              status === 'open'
                ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                : 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15',
            )}
          >
            {action}
            <ChevronRightIcon className="size-4" aria-hidden />
          </CauseLink>
        </div>
      </div>
    </article>
  )
}

function Poster({ src }: { src: string | null }) {
  const resolved = resolveMediaUrl(src)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [resolved])

  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#0b1222] ring-1 ring-white/10">
      {resolved && !failed ? (
        <img
          src={resolved}
          alt=""
          className="absolute inset-0 size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.28),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(56,189,248,0.16),transparent_50%)] text-white/50">
          <ImageIcon className="size-8" aria-hidden />
          <span className="text-[0.65rem] font-bold tracking-[0.14em] uppercase">
            Poster
          </span>
        </div>
      )}
    </div>
  )
}

function Countdown({
  units,
  label,
}: {
  units: { days: number; hours: number; minutes: number; seconds: number }
  label: string
}) {
  const parts = [
    units.days > 0 ? { value: units.days, name: 'Days' } : null,
    { value: units.hours, name: 'Hrs' },
    { value: units.minutes, name: 'Min' },
    { value: units.seconds, name: 'Sec' },
  ].filter((part) => part != null)

  return (
    <div
      className="flex justify-center gap-2"
      aria-live="polite"
      aria-label={`${label} ${units.days} days ${units.hours} hours ${units.minutes} minutes ${units.seconds} seconds`}
    >
      {parts.map((part) => (
        <div
          key={part.name}
          className="flex w-16 flex-col items-center rounded-2xl bg-white/10 px-2 py-2.5 ring-1 ring-white/10"
        >
          <span className="font-heading text-2xl font-bold tabular-nums">
            {String(part.value).padStart(2, '0')}
          </span>
          <span className="text-[0.6rem] font-semibold tracking-[0.16em] text-white/45 uppercase">
            {part.name}
          </span>
        </div>
      ))}
    </div>
  )
}

function useCountdown(iso: string | null) {
  const target = iso ? new Date(iso).getTime() : null
  const safeTarget = target != null && Number.isNaN(target) ? null : target
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (safeTarget == null) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [safeTarget])

  if (safeTarget == null) return null

  const total = Math.max(0, Math.floor((safeTarget - now) / 1000))
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor((total % 86_400) / 3_600),
    minutes: Math.floor((total % 3_600) / 60),
    seconds: total % 60,
  }
}

function CauseLink({
  cause,
  target,
  className,
  children,
}: {
  cause: VoteCause
  target: 'detail' | 'vote'
  className?: string
  children: ReactNode
}) {
  const id = cause.id.toString()
  if (target === 'vote') {
    return (
      <Link
        to="/voting/$voteId/vote"
        params={{ voteId: id }}
        search={{ view: getVoteStatus(cause) === 'ended' ? 'results' : undefined }}
        className={className}
      >
        {children}
      </Link>
    )
  }
  return (
    <Link to="/voting/$voteId" params={{ voteId: id }} className={className}>
      {children}
    </Link>
  )
}
