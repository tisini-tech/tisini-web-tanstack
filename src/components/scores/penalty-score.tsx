import { parsePenaltyScore } from '#/lib/scores'
import { cn } from '#/lib/utils'

type PenaltyScoreLineProps = {
  home: string | number | null | undefined
  away: string | number | null | undefined
  className?: string
}

export function PenaltyScoreLine({
  home,
  away,
  className,
}: PenaltyScoreLineProps) {
  const pens = parsePenaltyScore(home, away)
  if (!pens) return null

  const homeWin = pens.home > pens.away
  const awayWin = pens.away > pens.home

  return (
    <span
      className={cn(
        'font-mono text-[10px] leading-none tracking-wide',
        className,
      )}
    >
      <span className="sr-only">penalties </span>
      <span className="text-muted-foreground">(</span>
      <span className={homeWin ? 'text-foreground' : 'text-muted-foreground'}>{pens.home}</span>
      <span className="text-muted-foreground">–</span>
      <span className={awayWin ? 'text-foreground' : 'text-muted-foreground'}>{pens.away}</span>
      <span className="text-muted-foreground">)</span>
    </span>
  )
}
