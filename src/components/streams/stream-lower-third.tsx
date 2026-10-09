import { useEffect, useMemo, useState } from 'react'

import {
  footballLowerThirdStats,
  rugbyLowerThirdStats,
} from '#/components/streams/stats/lower-third'
import { isFootballFixType } from '#/lib/league-stream'
import type { FixtureDetails } from '#/lib/types'

interface Stat {
  stat: string
  home: string | number
  away: string | number
}

export function StreamLowerThird({
  details,
  fixType,
}: {
  details: FixtureDetails
  fixType: string
}) {
  const [currentStats, setCurrentStats] = useState<Stat[]>([
    { stat: 'Tries', home: '-', away: '-' },
  ])
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(false)

  const stats = useMemo(() => {
    return isFootballFixType(fixType)
      ? footballLowerThirdStats(details.stats)
      : rugbyLowerThirdStats(details.stats)
  }, [fixType, details])

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

  const fixture = details.fixture
  const active = currentStats[0] ?? { stat: '-', home: '-', away: '-' }
  const statLabel = String(active.stat)
  const statFontSize =
    statLabel.length > 24 ? 15 : statLabel.length > 18 ? 17 : 20

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-x-0 bottom-[6vh] flex justify-center px-4">
        <div className="flex w-fit max-w-[96vw] items-center gap-1 bg-[#023270] p-1.5">
          <div className="flex h-14 max-w-[28vw] items-center justify-center whitespace-nowrap rounded-sm bg-red-500 px-3 py-1 text-[22px] font-bold leading-tight text-white">
            <span className="truncate">{fixture.team1_name}</span>
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
            <span className="truncate">{fixture.team2_name}</span>
          </div>

          <div className="h-14 w-24 shrink-0">
            <img
              src="/tisini-logo.png"
              alt="Tisini"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
