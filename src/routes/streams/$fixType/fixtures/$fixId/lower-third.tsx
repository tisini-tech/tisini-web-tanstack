import { useEffect, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { fixtureDetailsQueryOptions } from '#/data/scores'
import { footballLowerThirdStats } from '#/components/streams/stats/lower-third'
import { rugbyLowerThirdStats } from '#/components/streams/stats/lower-third'

interface Stat {
  stat: string
  home: string | number
  away: string | number
}

type StatsArray = Stat[]

export const Route = createFileRoute(
  '/streams/$fixType/fixtures/$fixId/lower-third',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { fixId, fixType } = Route.useParams()
  const { data } = useSuspenseQuery(fixtureDetailsQueryOptions(fixId))

  const [currentStats, setCurrentStats] = useState<StatsArray>([
    { stat: 'Tries', home: '-', away: '-' },
  ])
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(false)

  const stats = useMemo(() => {
    if (!data) return []

    return fixType === 'football'
      ? footballLowerThirdStats(data.stats)
      : rugbyLowerThirdStats(data.stats)
  }, [fixType, data])

  useEffect(() => {
    if (!stats.length) return
    const safeIndex = index % stats.length
    setCurrentStats([stats[safeIndex]])
    if (safeIndex !== index) setIndex(safeIndex)
  }, [stats, index])

  useEffect(() => {
    if (!stats.length) return

    const interval = setInterval(() => {
      setFade(true)
      setTimeout(() => {
        const nextIndex = (index + 1) % stats.length
        setCurrentStats([stats[nextIndex]])
        setIndex(nextIndex)
        setFade(false)
      }, 300)
    }, 3000)

    return () => clearInterval(interval)
  }, [index, stats])

  const details = data?.fixture
  const active = currentStats[0] ?? { stat: '-', home: '-', away: '-' }

  const statLabel = String(active.stat)
  const statFontSize =
    statLabel.length > 24 ? 15 : statLabel.length > 18 ? 17 : 20

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      {/* Content-sized bar: only as wide as teams + stats need */}
      <div className="absolute inset-x-0 bottom-[6vh] flex justify-center px-4">
        <div className="flex w-fit max-w-[96vw] items-center gap-1 bg-[#023270] p-1.5">
          <div className="flex h-14 max-w-[28vw] items-center justify-center whitespace-nowrap rounded-sm bg-red-500 px-3 py-1 text-[22px] font-bold leading-tight text-white">
            <span className="truncate">{details?.team1_name}</span>
          </div>

          <div
            className={`flex h-14 items-stretch gap-1 transition-opacity duration-300 ease-in-out ${
              fade ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <div className="flex min-w-[3.25rem] items-center justify-center rounded-sm border bg-white px-2 text-[22px] font-semibold leading-tight text-blue-800">
              {active.home}
            </div>
            <div className="flex max-w-[36vw] items-center justify-center rounded-sm bg-[#1E6FD9] px-3 py-1 font-bold uppercase leading-tight text-white">
              <span
                className="whitespace-nowrap"
                style={{ fontSize: `${statFontSize}px` }}
              >
                {statLabel}
              </span>
            </div>
            <div className="flex min-w-[3.25rem] items-center justify-center rounded-sm border bg-white px-2 text-[22px] font-semibold leading-tight text-blue-800">
              {active.away}
            </div>
          </div>

          <div className="flex h-14 max-w-[28vw] items-center justify-center whitespace-nowrap rounded-sm bg-yellow-500 px-3 py-1 text-[22px] font-bold leading-tight text-black">
            <span className="truncate">{details?.team2_name}</span>
          </div>

          <div className="h-14 w-24 shrink-0">
            <img
              src={'/tisini-logo.png'}
              alt="Tisini"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
