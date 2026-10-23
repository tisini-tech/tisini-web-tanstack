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
      <SubArrow direction={substitution.direction} />
      <span className="font-mono text-[10px] text-muted-foreground">
        {substitution.minute}'
      </span>
    </span>
  )
}

/** Up = came on (now in the lineup). Down = came off (now on the bench). */
function SubArrow({
  direction,
  className = 'size-3.5',
}: {
  direction: 'in' | 'out'
  className?: string
}) {
  const cameOn = direction === 'in'
  return (
    <svg viewBox="0 0 24 24" className={`${className} shrink-0`} aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="9"
        className={
          cameOn
            ? 'fill-emerald-500/15 stroke-emerald-400/70'
            : 'fill-red-500/15 stroke-red-400/70'
        }
        strokeWidth="1.4"
      />
      <path
        d={
          cameOn
            ? 'M12 17V9M8.5 11.5 12 8l3.5 3.5'
            : 'M12 7v8M8.5 12.5 12 16l3.5-3.5'
        }
        fill="none"
        className={cameOn ? 'stroke-emerald-400' : 'stroke-red-400'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PitchSubArrow({ direction }: { direction: 'in' | 'out' }) {
  return <SubArrow direction={direction} className="size-3" />
}

export default HomePlayer
