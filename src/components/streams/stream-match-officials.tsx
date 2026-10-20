import { useEffect, useMemo, useState } from 'react'

import type { FixReferee } from '#/lib/types'
import { cn } from '#/lib/utils'

const ROLE_ORDER = [
  'main',
  'assistant_1',
  'assistant_2',
  'fourth_official',
] as const

const ROLE_LABELS: Record<string, string> = {
  main: 'Referee',
  assistant_1: 'Assistant 1',
  assistant_2: 'Assistant 2',
  fourth_official: 'Reserve Ref',
  referee: 'Referee',
  ar1: 'Assistant 1',
  ar2: 'Assistant 2',
}

/** Header alone, then each official peels in. */
const HEADER_ALONE_MS = 700
const STAGGER_MS = 650

function roleLabel(role: string) {
  const key = role.trim().toLowerCase()
  return ROLE_LABELS[key] ?? role.replace(/[_-]+/g, ' ')
}

function roleRank(role: string) {
  const key = role.trim().toLowerCase()
  const index = ROLE_ORDER.indexOf(key as (typeof ROLE_ORDER)[number])
  return index === -1 ? ROLE_ORDER.length : index
}

const panel =
  'bg-[linear-gradient(180deg,#0a4a9e_0%,#023270_55%,#012456_100%)] shadow-[0_4px_16px_rgba(0,0,0,0.45)]'

type StreamMatchOfficialsProps = {
  officials: FixReferee[]
  /** Bump to restart the staggered reveal. */
  playKey?: number
  className?: string
}

export function StreamMatchOfficials({
  officials,
  playKey = 0,
  className,
}: StreamMatchOfficialsProps) {
  const sorted = useMemo(
    () => [...officials].sort((a, b) => roleRank(a.role) - roleRank(b.role)),
    [officials],
  )

  /** How many official rows are visible (0 = header only). */
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
    if (sorted.length === 0) return

    const timers: number[] = []
    for (let i = 0; i < sorted.length; i++) {
      timers.push(
        window.setTimeout(
          () => setVisibleCount(i + 1),
          HEADER_ALONE_MS + i * STAGGER_MS,
        ),
      )
    }

    return () => {
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [playKey, sorted.length])

  if (sorted.length === 0) {
    return (
      <div
        className={cn(
          'w-fit max-w-[min(92vw,22rem)] overflow-hidden rounded-md px-4 py-3',
          panel,
          className,
        )}
      >
        <p className="text-sm font-bold tracking-wide text-white/80 uppercase">
          Officials TBA
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-fit max-w-[min(92vw,24rem)] overflow-hidden rounded-md',
        panel,
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/15 bg-white/10 px-3 py-1.5">
        <span className="text-[10px] font-black tracking-[0.18em] text-amber-200 uppercase sm:text-xs">
          Match Officials
        </span>
        <div className="ml-auto flex items-center rounded-sm bg-white px-1.5 py-0.5">
          <img
            src="/tisini-logo.png"
            alt=""
            width={72}
            height={24}
            className="h-5 w-auto object-contain sm:h-6"
          />
        </div>
      </div>

      <ul className="divide-y divide-white/10">
        {sorted.slice(0, visibleCount).map((official) => (
          <li
            key={official.id}
            className="stream-officials-row-in flex items-baseline gap-3 px-3 py-1.5 sm:gap-4 sm:py-2"
          >
            <span className="w-[6.5rem] shrink-0 text-[10px] font-bold tracking-wide text-sky-200/90 uppercase sm:w-28 sm:text-[11px]">
              {roleLabel(official.role)}
            </span>
            <span className="min-w-0 truncate text-sm font-semibold text-white sm:text-base">
              {official.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
