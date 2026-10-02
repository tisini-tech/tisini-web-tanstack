import { useEffect, useRef, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { ScoreBug } from '#/components/streams/score-bug'
import { fixtureDetailsQueryOptions } from '#/data/scores'
import { cn } from '#/lib/utils'

export const Route = createFileRoute(
  '/streams/$fixType/fixtures/$fixId/score-bug',
)({
  component: RouteComponent,
})

/** Hold duration after a 5-min milestone trigger. */
const PROMO_HOLD_MS = 12_000
const PROMO_EXIT_MS = 400

function isPromoMinute(minute: number) {
  return minute >= 5 && minute % 5 === 0
}

function RouteComponent() {
  const { fixId } = Route.useParams()
  const { data } = useSuspenseQuery(fixtureDetailsQueryOptions(fixId))
  const fixture = data.fixture
  const minute = fixture.minute
  const status = fixture.game_status

  const [promoPhase, setPromoPhase] = useState<'idle' | 'in' | 'out'>('idle')
  const lastShownMinute = useRef<number | null>(null)

  useEffect(() => {
    // Only during live play — not HT / FT / pre-match
    if (status !== 'started') return
    if (!isPromoMinute(minute)) return
    if (lastShownMinute.current === minute) return

    lastShownMinute.current = minute
    setPromoPhase('in')

    const exitTimer = window.setTimeout(() => setPromoPhase('out'), PROMO_HOLD_MS)
    const idleTimer = window.setTimeout(
      () => setPromoPhase('idle'),
      PROMO_HOLD_MS + PROMO_EXIT_MS,
    )

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(idleTimer)
    }
  }, [minute, status])

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div className="absolute top-[5vh] left-[3vw] flex flex-col items-start gap-1.5">
        <div className="score-bug-enter">
          <ScoreBug fixture={fixture} />
        </div>

        {/* Shows at match mins 5, 10, 15, 20… then slides out */}
        {promoPhase !== 'idle' ? (
          <div
            className={cn(
              'flex w-fit max-w-[min(92vw,34rem)] items-stretch overflow-hidden rounded-md shadow-[0_4px_14px_rgba(0,0,0,0.4)]',
              promoPhase === 'in' && 'score-bug-promo-in',
              promoPhase === 'out' && 'score-bug-promo-out',
            )}
          >
            <div className="flex shrink-0 items-center bg-[#f5c518] px-2.5 text-[10px] font-black tracking-[0.14em] text-[#023270] uppercase sm:text-xs">
              Win
            </div>
            <div className="flex min-w-0 items-center gap-2 bg-[linear-gradient(180deg,#0a4a9e_0%,#023270_55%,#012456_100%)] px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold tracking-wide text-white sm:text-sm">
                  Play the quiz · win a jersey
                </p>
                <p className="truncate text-[10px] font-semibold tracking-wide text-sky-200/90 uppercase sm:text-[11px]">
                  tisini.co.ke
                </p>
              </div>
              <img
                src="/t-shirt.png"
                alt="Jersey prize"
                width={48}
                height={48}
                className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
              />
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
