import { FootballStats } from '#/components/streams/stats/football'
import { RugbyStats } from '#/components/streams/stats/rugby'
import { fixtureDetailsQueryOptions } from '#/data/scores'
import { matchStatusLabel } from '#/lib/scores'
import type { FixtureStats } from '#/lib/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/streams/$fixType/fixtures/$fixId/stats')(
  {
    component: RouteComponent,
  },
)

const scoreBar =
  'bg-[linear-gradient(180deg,#0a4a9e_0%,#023270_55%,#012456_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_12px_rgba(0,0,0,0.35)]'

const silverCap =
  'bg-[linear-gradient(180deg,#ffffff_0%,#e8ecf1_50%,#c5ccd6_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.25)]'

function RouteComponent() {
  const { fixId, fixType } = Route.useParams()
  const { data } = useSuspenseQuery(fixtureDetailsQueryOptions(fixId))
  const fixture = data.fixture
  const statusLabel = matchStatusLabel(fixture)

  return (
    <main className="flex min-h-screen justify-center px-4 pt-12">
      <div className="w-full max-w-[820px]">
        {statusLabel ? (
          <p className="mx-auto mb-4 w-fit rounded-full bg-white px-5 py-1.5 text-center text-sm font-extrabold tracking-wide text-zinc-900 uppercase">
            {statusLabel === 'FT' ? 'Full Time' : statusLabel}
          </p>
        ) : null}

        {/* Score bar — broadcast style, no white card */}
        <div
          className={`relative flex h-16 items-stretch overflow-hidden rounded-full sm:h-[4.5rem] ${scoreBar}`}
        >
          <div className={`w-7 shrink-0 sm:w-8 ${silverCap}`} aria-hidden />
          <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 text-base font-bold tracking-wide text-white uppercase sm:text-xl">
            <span className="truncate text-left">{fixture.team1_name}</span>
            <span className="text-xl tabular-nums whitespace-nowrap sm:text-2xl">
              {fixture.home_score} – {fixture.away_score}
            </span>
            <span className="truncate text-right">{fixture.team2_name}</span>
          </div>
          <div className={`w-7 shrink-0 sm:w-8 ${silverCap}`} aria-hidden />
        </div>

        <div
          className={`mx-auto mt-5 flex h-14 w-[85%] items-stretch overflow-hidden rounded-full sm:h-16 ${scoreBar}`}
        >
          <div className={`w-5 shrink-0 sm:w-6 ${silverCap}`} aria-hidden />
          <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:gap-4 sm:px-4">
            <span className="justify-self-end text-right text-sm font-extrabold tracking-[0.18em] text-white uppercase sm:text-base">
              Match
            </span>
            <img
              src="/tisini-logo.png"
              alt="Tisini"
              width={220}
              height={72}
              className="h-10 w-auto object-contain sm:h-12"
            />
            <span className="justify-self-start text-left text-sm font-extrabold tracking-[0.18em] text-white uppercase sm:text-base">
              Statistics
            </span>
          </div>
          <div className={`w-5 shrink-0 sm:w-6 ${silverCap}`} aria-hidden />
        </div>

        <section className="mt-4">
          {fixType === 'football' ? (
            <FootballStats data={data.stats as FixtureStats} />
          ) : fixType === 'rugby7' ||
            fixType === 'rugby15' ||
            fixType === 'rugby10' ? (
            <RugbyStats data={data.stats as FixtureStats} />
          ) : (
            <div className="flex h-20 items-center justify-center text-white">
              Data is coming soon!
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
