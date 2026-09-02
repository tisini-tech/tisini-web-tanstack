import { Link, useRouterState } from '@tanstack/react-router'
import { buildLeagueSlug, getDefaultSeasonId } from '@/lib/leagues'
import { cn } from '@/lib/utils'

const LeaguesMenu = () => {
  const activeLeagueId = useRouterState({
    select: (s) => {
      const match = s.location.pathname.match(/^\/livescores\/leagues\/([^/]+)/)
      return match?.[1] ?? null
    },
  })

  return (
    <section className="p-3 sm:p-4">
      <div className="border-b border-emerald-400/40 pb-3">
        <h3 className="font-heading text-sm font-bold tracking-wide text-accent-foreground uppercase">
          Leagues
        </h3>
      </div>

      <div className="mt-3 space-y-4">
        {Object.entries(leagues).map(([key, sports]) => {
          return (
            <div key={key}>
              <div className="px-1 py-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                {key}
              </div>

              <div className="space-y-1">
                {sports.map((value) => {
                  const slug = buildLeagueSlug(key, value)
                  const active = activeLeagueId === slug

                  return (
                    <Link
                      key={value.id}
                      to="/livescores/leagues/$leagueId"
                      params={{ leagueId: slug }}
                      search={{ season: getDefaultSeasonId(value) }}
                      className={cn(
                        'block w-full rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors',
                        active
                          ? 'border-emerald-400/40 bg-emerald-500/15 text-accent-foreground'
                          : 'border-transparent text-foreground/90 hover:border-border hover:bg-muted/40 hover:text-accent-foreground',
                      )}
                    >
                      {value.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default LeaguesMenu

export type SeriesMenu = { serie: string; id: string }
export type SeasonMenu = { id: string; season: string; series: SeriesMenu[] }
export type LeagueMenu = {
  id: string
  name: string
  type: string
  series: boolean
  seasons: SeasonMenu[]
}
export type LeagueData = {
  [sport: string]: LeagueMenu[]
}

export const leagues: LeagueData = {
  rugby: [
    {
      id: '238',
      name: 'Sportpesa 7s',
      type: 'rugby7',
      series: true,
      seasons: [
        {
          id: '',
          season: '2025',
          series: [
            { serie: 'Dala 7s', id: '122' },
            { serie: 'Kabeberi 7s', id: '121' },
            { serie: 'Embu 7s', id: '117' },
            { serie: 'Christie 7s', id: '111' },
            { serie: 'Prinsloo 7s', id: '104' },
            { serie: 'Driftwood 7s', id: '103' },
          ],
        },
      ],
    },
    {
      id: '246',
      name: 'Kenya u18 Trials',
      type: 'rugby15',
      series: false,
      seasons: [{ id: '118', season: '2025', series: [] }],
    },
  ],
  football: [
    {
      id: '205',
      name: 'SportPesa League',
      type: 'football',
      series: false,
      seasons: [{ id: '123', season: '25/26', series: [] }],
    },
    {
      id: '26',
      name: 'FKF Women Premier League',
      type: 'football',
      series: false,
      seasons: [{ id: '133', season: '25/26', series: [] }],
    },
    {
      id: '202',
      name: 'FKF National Super League',
      type: 'football',
      series: false,
      seasons: [{ id: '131', season: '25/26', series: [] }],
    },
    {
      id: '267',
      name: 'Wadau Champions League',
      type: 'football',
      series: false,
      seasons: [{ id: '162', season: '2026', series: [] }],
    },
  ],
  //   basketball: [],
}
