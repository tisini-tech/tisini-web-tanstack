import type { SubAppearance } from '#/lib/substitutions'
import { SubMark } from '@/components/scores/lineups/HomePlayer'

type AwayPlayerProps = {
  name: string
  jersey: string
  substitution?: SubAppearance | null
}

const AwayPlayer = ({ name, jersey, substitution }: AwayPlayerProps) => {
  return (
    <div className="flex items-center justify-end gap-2 py-0.5">
      <SubMark substitution={substitution} />
      <span className="font-heading text-sm font-bold capitalize text-foreground">
        {name}
      </span>
      <span className="font-heading text-sm font-bold text-emerald-400">
        {jersey}
      </span>
    </div>
  )
}

export default AwayPlayer
