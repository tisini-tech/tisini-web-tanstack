const navy =
  'bg-[linear-gradient(180deg,#0a4a9e_0%,#023270_55%,#012456_100%)]'

const silver =
  'bg-[linear-gradient(180deg,#ffffff_0%,#e8ecf1_50%,#c5ccd6_100%)]'

export const StatRow = ({
  hStat,
  title,
  aStat,
}: {
  hStat: string | number
  title: string
  aStat: string | number
}) => {
  return (
    <div className="mb-2 grid grid-cols-[4.5rem_1fr_4.5rem] items-stretch gap-1.5 sm:grid-cols-[5.5rem_1fr_5.5rem] sm:gap-2">
      <div
        className={`flex items-center justify-center rounded-sm ${silver} text-lg font-bold tabular-nums text-[#023270] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.25)] sm:text-xl`}
      >
        {hStat}
      </div>
      <div
        className={`flex min-h-11 items-center justify-center ${navy} px-3 py-3 text-center text-sm font-bold tracking-wide text-white uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] sm:min-h-12 sm:text-base`}
      >
        {title}
      </div>
      <div
        className={`flex items-center justify-center rounded-sm ${silver} text-lg font-bold tabular-nums text-[#023270] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.25)] sm:text-xl`}
      >
        {aStat}
      </div>
    </div>
  )
}

export function StreamInsightsBy() {
  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-1.5">
      <span className="text-lg font-semibold text-zinc-900 italic">
        Insights by:
      </span>
      <img
        src="/tisini-logo.png"
        alt="Tisini"
        width={220}
        height={72}
        className="h-14 w-auto object-contain sm:h-16"
      />
    </div>
  )
}
