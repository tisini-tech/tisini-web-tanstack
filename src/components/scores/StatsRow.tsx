type StatsRowProps = {
  homeStat: number
  stat: string
  awayStat: number
  homeOnly: boolean
  awayOnly: boolean
  bothTeams: boolean
}

const StatsRow = ({
  homeStat,
  stat,
  awayStat,
  homeOnly,
  awayOnly,
  bothTeams,
}: StatsRowProps) => {
  const total = homeStat + awayStat
  const homePercentage = total === 0 ? 0 : (homeStat / total) * 100
  const awayPercentage = total === 0 ? 0 : (awayStat / total) * 100

  return (
    <div className="flex flex-col gap-1.5 px-1 py-2">
      <div className="flex items-center justify-between text-sm font-semibold sm:text-base">
        <div className="tabular-nums text-foreground">
          {bothTeams || homeOnly ? homeStat : '–'}
        </div>
        <div className="px-2 text-center text-xs font-medium text-muted-foreground sm:text-sm">
          {stat}
        </div>
        <div className="tabular-nums text-foreground">
          {bothTeams || awayOnly ? awayStat : '–'}
        </div>
      </div>

      <div className="flex gap-1.5">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/60">
          <div
            className="ml-auto h-full rounded-full bg-sky-500/80 transition-[width]"
            style={{ width: `${homePercentage}%` }}
          />
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/60">
          <div
            className="h-full rounded-full bg-amber-500/80 transition-[width]"
            style={{ width: `${awayPercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default StatsRow
