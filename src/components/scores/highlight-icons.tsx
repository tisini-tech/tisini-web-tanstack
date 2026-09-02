import type { RugbyScoreKind } from '#/lib/rugby-highlight-metrics'
import { cn } from '#/lib/utils'

export type HighlightIconType =
  | 'try'
  | 'conversion'
  | 'missed_conversion'
  | 'penalty'
  | 'missed_penalty'
  | 'drop'
  | 'missed_drop'
  | 'yellow_card'
  | 'red_card'
  | 'goal'
  | 'assist'
  | 'sub_out'
  | 'sub_in'
  | 'bb_two'
  | 'bb_three'
  | 'bb_ft'
  | null

type HighlightIconProps = {
  type: HighlightIconType
  className?: string
}

export function scoreKindToIconType(
  kind: RugbyScoreKind | null,
): HighlightIconType {
  if (!kind) return 'try'
  return kind
}

export function HighlightIcon({ type, className }: HighlightIconProps) {
  if (!type) return null

  return (
    <span
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center align-middle',
        className,
      )}
      aria-hidden="true"
    >
      {renderIcon(type)}
    </span>
  )
}

function renderIcon(type: HighlightIconType) {
  switch (type) {
    case 'try':
      return <RugbyBallIcon />
    case 'conversion':
      return <ConversionIcon />
    case 'missed_conversion':
      return <ConversionIcon missed />
    case 'penalty':
      return <PenaltyKickIcon />
    case 'missed_penalty':
      return <PenaltyKickIcon missed />
    case 'drop':
      return <DropGoalIcon />
    case 'missed_drop':
      return <DropGoalIcon missed />
    case 'yellow_card':
      return <CardIcon tone="yellow" />
    case 'red_card':
      return <CardIcon tone="red" />
    case 'goal':
      return <SoccerBallIcon />
    case 'bb_two':
      return <BasketballScoreIcon label="2" tone="two" />
    case 'bb_three':
      return <BasketballScoreIcon label="3" tone="three" />
    case 'bb_ft':
      return <BasketballScoreIcon label="FT" tone="ft" />
    case 'assist':
      return <AssistIcon />
    case 'sub_out':
      return <SubArrowIcon direction="out" />
    case 'sub_in':
      return <SubArrowIcon direction="in" />
    default:
      return null
  }
}

function RugbyBallIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-full drop-shadow-sm" fill="none">
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="6.5"
        transform="rotate(-35 12 12)"
        className="fill-amber-600 stroke-amber-300"
        strokeWidth="1.2"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="6.5"
        transform="rotate(-35 12 12)"
        className="fill-amber-500/40"
      />
      <path
        d="M8 10.5c1.2 1.8 3.2 3 5.5 3.4"
        className="stroke-amber-100"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9.2 13.2c1.5-.2 3-.8 4.2-1.8"
        className="stroke-amber-50/90"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M10.5 9.2c.4 1.2.6 2.5.4 3.8"
        className="stroke-amber-100/80"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ConversionIcon({ missed = false }: { missed?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-full drop-shadow-sm" fill="none">
      <path
        d="M5 20V9.5L12 4l7 5.5V20"
        className={missed ? 'stroke-red-400/80' : 'stroke-emerald-300/90'}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 20v-6h6v6"
        className={missed ? 'fill-red-500/25 stroke-red-400' : 'fill-emerald-400/20 stroke-emerald-300'}
        strokeWidth="1.4"
      />
      <circle
        cx="12"
        cy="11"
        r="2.2"
        className={missed ? 'fill-red-400' : 'fill-amber-400'}
      />
      {missed ? (
        <path
          d="M7 7l10 10M17 7L7 17"
          className="stroke-red-400"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  )
}

function PenaltyKickIcon({ missed = false }: { missed?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-full drop-shadow-sm" fill="none">
      <path
        d="M4 19h16"
        className="stroke-white/25"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 19V8h8v11"
        className={missed ? 'stroke-red-400/80' : 'stroke-sky-300/90'}
        strokeWidth="1.6"
      />
      <path
        d="M8 8l4-4 4 4"
        className={missed ? 'stroke-red-400' : 'stroke-sky-300'}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="14"
        r="2.4"
        className={missed ? 'fill-red-400' : 'fill-amber-400'}
      />
      {missed ? (
        <path
          d="M7.5 7.5l9 9"
          className="stroke-red-400"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  )
}

function DropGoalIcon({ missed = false }: { missed?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-full drop-shadow-sm" fill="none">
      <circle
        cx="12"
        cy="12"
        r="8"
        className={missed ? 'stroke-red-400/70' : 'stroke-violet-300/80'}
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        className={missed ? 'stroke-red-400/50' : 'stroke-violet-300/50'}
        strokeWidth="1.2"
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        className={missed ? 'fill-red-400' : 'fill-violet-400'}
      />
      {missed ? (
        <path
          d="M7 7l10 10"
          className="stroke-red-400"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  )
}

function CardIcon({ tone }: { tone: 'yellow' | 'red' }) {
  const fill = tone === 'yellow' ? 'fill-amber-400' : 'fill-red-500'
  const stroke = tone === 'yellow' ? 'stroke-amber-200' : 'stroke-red-300'
  const shadow =
    tone === 'yellow' ? 'drop-shadow-[0_1px_2px_rgba(251,191,36,0.45)]' : 'drop-shadow-[0_1px_2px_rgba(239,68,68,0.5)]'

  return (
    <svg viewBox="0 0 24 24" className={cn('size-full', shadow)} fill="none">
      <rect
        x="7"
        y="3.5"
        width="10"
        height="17"
        rx="1.8"
        className={cn(fill, stroke)}
        strokeWidth="1.2"
      />
      <rect
        x="8.2"
        y="5"
        width="7.6"
        height="3"
        rx="0.8"
        className="fill-white/25"
      />
    </svg>
  )
}

function SoccerBallIcon() {
  // From game-icons "soccer-ball" (CC BY) — same asset as svgrepo.com/svg/323288/soccer-ball
  return (
    <svg
      viewBox="0 0 512 512"
      className="size-full drop-shadow-sm text-foreground"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M255.03 33.813a229 229 0 0 0-5.5.03c-6.73.14-13.462.605-20.155 1.344c.333.166.544.32.47.438L204.78 75.063l73.907 49.437l-.125.188l70.625.28L371 79.282L342.844 52a225.6 225.6 0 0 0-49.47-14.78c-12.65-2.24-25.497-3.36-38.343-3.407zM190.907 88.25l-73.656 36.78l-13.813 98.407l51.344 33.657l94.345-43.438l14.875-76.5l-73.094-48.906zm196.344.344l-21.25 44.5l36.75 72.72l62.063 38.905l11.312-21.282c.225.143.45.403.656.75c-.77-4.954-1.71-9.893-2.81-14.782c-6.446-28.59-18.59-55.962-35.5-79.97c-9.07-12.872-19.526-24.778-31.095-35.5l-20.125-5.342zm-302.656 23c-6.906 8.045-13.257 16.56-18.938 25.5c-15.676 24.664-26.44 52.494-31.437 81.312A223 223 0 0 0 31 261l20.25 5.094l33.03-40.5L98.75 122.53l-14.156-10.936zm312.719 112.844l-55.813 44.75l-3.47 101.093l39.626 21.126l77.188-49.594l4.406-78.75l-.094.157l-61.844-38.783zm-140.844 6.406l-94.033 43.312l-1.218 76.625l89.155 57.376l68.938-36.437l3.437-101.75l-66.28-39.126zm-224.22 49.75c.91 8.436 2.29 16.816 4.156 25.094c6.445 28.59 18.62 55.96 35.532 79.968c3.873 5.5 8.02 10.805 12.374 15.938l-9.374-48.156l.124-.032l-27.03-68.844zm117.188 84.844l-51.532 8.156l10.125 52.094a225 225 0 0 0 27.314 20.437a226.3 226.3 0 0 0 46.687 22.594l62.626-13.69l-4.344-31.124l-90.875-58.47zm302.437.5l-64.22 41.25l-42 47.375l4.408 6.156c12.027-5.545 23.57-12.144 34.406-19.72c23.97-16.76 44.604-38.304 60.28-62.97c2.51-3.947 4.87-7.99 7.125-12.092zm-122.78 97.656l-79.94 9.625l-25.968 5.655c26.993 4 54.717 3.044 81.313-2.813c9.412-2.072 18.684-4.79 27.75-8.062l-3.156-4.406z" />
    </svg>
  )
}

function BasketballScoreIcon({
  label,
  tone,
}: {
  label: string
  tone: 'two' | 'three' | 'ft'
}) {
  const palette =
    tone === 'three'
      ? {
          fill: 'fill-violet-500',
          stroke: 'stroke-violet-300',
          seam: 'stroke-violet-950/50',
        }
      : tone === 'ft'
        ? {
            fill: 'fill-sky-500',
            stroke: 'stroke-sky-300',
            seam: 'stroke-sky-950/45',
          }
        : {
            fill: 'fill-orange-500',
            stroke: 'stroke-orange-300',
            seam: 'stroke-orange-950/50',
          }

  return (
    <span className="relative inline-flex size-full items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 size-full drop-shadow-sm"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          className={cn(palette.fill, palette.stroke)}
          strokeWidth="1.2"
        />
        <path
          d="M12 3v18M3.5 10.5c2.8 1 5.6 1.5 8.5 1.5s5.7-.5 8.5-1.5M3.5 13.5c2.8-1 5.6-1.5 8.5-1.5s5.7.5 8.5 1.5"
          className={palette.seam}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M7 4.8c2 3.2 3.2 6.6 3.2 7.2S9 16 7 19.2M17 4.8c-2 3.2-3.2 6.6-3.2 7.2S15 16 17 19.2"
          className={palette.seam}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
      <span className="relative z-10 font-heading text-[8px] font-black leading-none text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.65)]">
        {label}
      </span>
    </span>
  )
}

function AssistIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-full drop-shadow-sm" fill="none">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        className="fill-sky-500/20 stroke-sky-300"
        strokeWidth="1.4"
      />
      <path
        d="M8 12h8M13 8.5L16.5 12 13 15.5"
        className="stroke-sky-300"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SubArrowIcon({ direction }: { direction: 'in' | 'out' }) {
  const isIn = direction === 'in'
  return (
    <svg viewBox="0 0 24 24" className="size-full drop-shadow-sm" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        className={isIn ? 'fill-emerald-500/15 stroke-emerald-400/50' : 'fill-red-500/15 stroke-red-400/50'}
        strokeWidth="1.2"
      />
      <path
        d={isIn ? 'M12 7v8M8.5 12.5 12 16l3.5-3.5' : 'M12 17V9M8.5 11.5 12 8l3.5 3.5'}
        className={isIn ? 'stroke-emerald-400' : 'stroke-red-400'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
