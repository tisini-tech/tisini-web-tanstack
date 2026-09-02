import type { Standing } from '#/lib/types'
import { TeamLogo } from '@/components/scores/team-logo'
import { cn } from '@/lib/utils'

type LeagueStandingsTableProps = {
  standings: Standing[]
  tournId: string
}

function relegationIndex(tournId: string) {
  if (tournId === '26') return 9
  if (tournId === '202') return 16
  if (tournId === '205') return 15
  return 16
}

function relegationLegendPosition(tournId: string) {
  if (tournId === '26') return 10
  if (tournId === '202') return 17
  return 16
}

function isChampion(idx: number) {
  return idx === 0
}

function isRelegation(idx: number, tournId: string) {
  return idx >= relegationIndex(tournId)
}

function isHomeWinOrDraw(score: string) {
  const [home, away] = score.split('-').map((s) => Number(s.trim()))
  if (!Number.isFinite(home) || !Number.isFinite(away)) return false
  return home >= away
}

export function LeagueStandingsTable({
  standings,
  tournId,
}: LeagueStandingsTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-12 border-b border-border bg-muted/40 px-4 py-3 font-heading text-xs font-semibold tracking-wide text-accent-foreground uppercase">
            <div className="col-span-6 flex items-center">
              <span className="w-6 text-center">#</span>
              <span>Team</span>
            </div>
            <div className="col-span-1 text-center">MP</div>
            <div className="col-span-1 text-center">W</div>
            <div className="col-span-1 text-center">D</div>
            <div className="col-span-1 text-center">L</div>
            <div className="col-span-1 text-center">GD</div>
            <div className="col-span-1 text-center text-emerald-400">Pts</div>
          </div>

          <div className="divide-y divide-border">
            {standings.map((item, idx) => (
              <StandingsRow
                key={item.id}
                item={item}
                idx={idx}
                tournId={tournId}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-muted/20 p-4">
        <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-xs font-medium text-white">
              1
            </span>
            <span className="text-sm text-foreground/90">Champions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-red-600 text-xs font-medium text-white">
              {relegationLegendPosition(tournId)}
            </span>
            <span className="text-sm text-foreground/90">Relegation</span>
          </div>
        </div>

        <p className="border-t border-border pt-2 text-xs text-muted-foreground italic">
          If teams finish on equal points at the end of the season, goal
          difference will be the tie-breaker.
        </p>
      </div>
    </div>
  )
}

type StandingsRowProps = {
  item: Standing
  idx: number
  tournId: string
}

function StandingsRow({ item, idx, tournId }: StandingsRowProps) {
  const champion = isChampion(idx)
  const relegation = isRelegation(idx, tournId)

  return (
    <div
      className={cn(
        'grid grid-cols-12 items-center px-4 py-3 transition-colors',
        champion && 'border-l-4 border-l-emerald-500 bg-emerald-500/10',
        relegation &&
          !champion &&
          'border-l-4 border-l-red-500 bg-red-500/10',
        !champion && !relegation && 'hover:bg-muted/30',
      )}
    >
      <div className="col-span-6 flex min-w-0 items-center gap-2 sm:gap-3">
        <span
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium',
            champion && 'bg-emerald-600 text-white',
            relegation && !champion && 'bg-red-600 text-white',
            !champion && !relegation && 'bg-white/10 text-foreground',
          )}
        >
          {idx + 1}
        </span>
        <TeamLogo
          src={item.logo}
          alt={item.team_name}
          fallbackSrc="/homeLogo.png"
          className="h-6 w-6"
        />
        <span className="min-w-0 flex-1 truncate font-medium text-foreground">
          {item.team_name}
        </span>

        {item.live ? (
          <div className="flex shrink-0 items-center gap-2">
            <span
              className="h-3 w-3 animate-pulse rounded-full bg-emerald-500"
              aria-label="Live match in progress"
            />
            <span
              className={cn(
                'text-sm font-medium',
                isHomeWinOrDraw(item.live.score)
                  ? 'text-emerald-400'
                  : 'text-red-400',
              )}
            >
              {item.live.score}
            </span>
          </div>
        ) : null}
      </div>

      <div className="col-span-1 text-center text-sm text-muted-foreground">
        {item.P}
      </div>
      <div className="col-span-1 text-center text-sm text-muted-foreground">
        {item.W}
      </div>
      <div className="col-span-1 text-center text-sm text-muted-foreground">
        {item.D}
      </div>
      <div className="col-span-1 text-center text-sm text-muted-foreground">
        {item.L}
      </div>
      <div className="col-span-1 text-center text-sm font-medium text-foreground">
        {item.GD}
      </div>
      <div className="col-span-1 text-center text-sm font-bold text-accent-foreground">
        {item.Pts}
      </div>
    </div>
  )
}
