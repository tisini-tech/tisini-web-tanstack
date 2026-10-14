import { HighlightIcon } from '#/components/scores/highlight-icons'
import type { SubAppearance } from '#/lib/substitutions'

type HomePlayerProps = {
  jersey: string
  name: string
  substitution?: SubAppearance | null
}

const HomePlayer = ({ jersey, name, substitution }: HomePlayerProps) => {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="font-heading text-sm font-bold text-emerald-400">
        {jersey}
      </span>
      <span className="font-heading text-sm font-bold capitalize text-foreground">
        {name}
      </span>
      <SubMark substitution={substitution} />
    </div>
  )
}

export function SubMark({
  substitution,
  onPitch = false,
}: {
  substitution?: SubAppearance | null
  onPitch?: boolean
}) {
  if (!substitution) return null

  const cameOn = substitution.direction === 'in'
  const label = cameOn
    ? `Came on ${substitution.minute}'`
    : `Substituted off ${substitution.minute}'`

  if (onPitch) {
    return (
      <span
        className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#012456]/90 px-1 py-px ring-1 ring-amber-300/80"
        title={label}
      >
        <PitchSubArrow direction={substitution.direction} />
        <span className="font-mono text-[9px] font-bold text-amber-200">
          {substitution.minute}'
        </span>
      </span>
    )
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-0.5" title={label}>
      <HighlightIcon
        type={cameOn ? 'sub_in' : 'sub_out'}
        className="size-3.5"
      />
      <span className="font-mono text-[10px] text-muted-foreground">
        {substitution.minute}'
      </span>
    </span>
  )
}

function PitchSubArrow({ direction }: { direction: 'in' | 'out' }) {
  const cameOn = direction === 'in'
  return (
    <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden="true">
      <path
        d={cameOn ? 'M6 1.5v7M3.2 6.2 6 9.2l2.8-3' : 'M6 10.5v-7M3.2 5.8 6 2.8l2.8 3'}
        fill="none"
        className={cameOn ? 'stroke-amber-300' : 'stroke-red-400'}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default HomePlayer
