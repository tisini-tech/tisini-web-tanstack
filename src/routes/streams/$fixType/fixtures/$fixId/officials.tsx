import { useEffect, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { StreamMatchOfficials } from '#/components/streams/stream-match-officials'
import { fixtureDetailsQueryOptions } from '#/data/scores'
import { cn } from '#/lib/utils'

export const Route = createFileRoute(
  '/streams/$fixType/fixtures/$fixId/officials',
)({
  component: RouteComponent,
})

/** Whole graphic on screen (enter → reveal → hold), then exit. */
const HOLD_MS = 20_000
const EXIT_MS = 450

type Phase = 'idle' | 'in' | 'out'

function RouteComponent() {
  const { fixId } = Route.useParams()
  const { data: details } = useSuspenseQuery(fixtureDetailsQueryOptions(fixId))
  const officials = details.fixture.referees ?? []

  const [playKey, setPlayKey] = useState(0)
  const [phase, setPhase] = useState<Phase>('in')

  useEffect(() => {
    setPhase('in')

    const outTimer = window.setTimeout(() => setPhase('out'), HOLD_MS)
    const idleTimer = window.setTimeout(
      () => setPhase('idle'),
      HOLD_MS + EXIT_MS,
    )

    return () => {
      window.clearTimeout(outTimer)
      window.clearTimeout(idleTimer)
    }
  }, [playKey])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.key !== ' ') return
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      event.preventDefault()
      setPlayKey((key) => key + 1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {phase !== 'idle' ? (
        <div
          key={playKey}
          className={cn(
            'absolute bottom-[5vh] left-[3vw]',
            phase === 'in' && 'stream-officials-in',
            phase === 'out' && 'stream-officials-out',
          )}
        >
          <StreamMatchOfficials officials={officials} playKey={playKey} />
        </div>
      ) : null}
    </main>
  )
}
