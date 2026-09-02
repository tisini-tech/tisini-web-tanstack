type PosessionProps = {
  homeStat: string
  stat: string
  awayStat: string
}

const PosessionRow = ({ homeStat, stat, awayStat }: PosessionProps) => {
  const home = Number(homeStat) || 0
  const away = Number(awayStat) || 0
  const total = home + away
  const homePercentage = total === 0 ? 0 : (home / total) * 100
  const awayPercentage = total === 0 ? 0 : (away / total) * 100

  return (
    <div className="flex flex-col gap-1.5 px-1 py-2">
      <div className="flex items-center justify-between text-sm font-semibold sm:text-base">
        <div className="tabular-nums text-foreground">{`${home}%`}</div>
        <div className="px-2 text-center text-xs font-medium text-muted-foreground sm:text-sm">
          {stat}
        </div>
        <div className="tabular-nums text-foreground">{`${away}%`}</div>
      </div>

      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full bg-sky-500/80 transition-[width]"
          style={{ width: `${homePercentage}%` }}
        />
        <div
          className="h-full bg-amber-500/80 transition-[width]"
          style={{ width: `${awayPercentage}%` }}
        />
      </div>
    </div>
  )
}

export default PosessionRow
