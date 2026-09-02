import { cn } from '#/lib/utils'

type AccuracyProps = {
  hComp: number
  aComp: number
  hTotal: number
  aTotal: number
  stat: string
  homeOnly: boolean
  awayOnly: boolean
  bothTeams: boolean
}

const AccuracyRow = ({
  hComp,
  aComp,
  hTotal,
  aTotal,
  stat,
  homeOnly,
  awayOnly,
  bothTeams,
}: AccuracyProps) => {
  const homePercentage = hTotal === 0 ? 0 : (hComp / hTotal) * 100
  const awayPercentage = aTotal === 0 ? 0 : (aComp / aTotal) * 100

  return (
    <div className="flex items-center gap-2 px-1 py-2">
      <div className="flex w-2/5 items-center gap-2 text-sm font-semibold tabular-nums sm:gap-3 sm:text-base">
        {bothTeams || homeOnly ? `${hComp}/${hTotal}` : '–'}
        <CircularPercentageIndicator
          percentage={homePercentage}
          tone="home"
          size={44}
        />
      </div>
      <div className="w-1/5 text-center text-xs font-medium text-muted-foreground sm:text-sm">
        {stat}
      </div>
      <div className="flex w-2/5 items-center justify-end gap-2 text-sm font-semibold tabular-nums sm:gap-3 sm:text-base">
        <CircularPercentageIndicator
          percentage={awayPercentage}
          tone="away"
          size={44}
        />
        {bothTeams || awayOnly ? `${aComp}/${aTotal}` : '–'}
      </div>
    </div>
  )
}

export default AccuracyRow

type CircularProps = {
  percentage: number
  tone: 'home' | 'away'
  size?: number
}

export const CircularPercentageIndicator = ({
  percentage,
  tone,
  size = 44,
}: CircularProps) => {
  const radius = size / 2 - 5
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const stroke = tone === 'home' ? 'rgb(14 165 233 / 0.85)' : 'rgb(245 158 11 / 0.85)'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-muted"
          strokeWidth="5"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth="5"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center font-mono text-[10px] font-semibold tabular-nums',
          percentage === 0 ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {percentage === 0 ? '–' : `${percentage.toFixed(0)}%`}
      </div>
    </div>
  )
}
