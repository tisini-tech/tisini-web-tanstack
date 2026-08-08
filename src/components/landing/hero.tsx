import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const AUTO_ADVANCE_MS = 6500

type FocusId = 'sports' | 'stories' | 'edtech' | 'fintech' | 'tech'

type Focus = {
  id: FocusId
  label: string
  eyebrow: string
  title: string
  description: string
  primaryCta: { label: string; to: string }
  secondaryCta?: { label: string; to: string }
  metric: { label: string; value: string }
}

const focuses: Focus[] = [
  {
    id: 'sports',
    label: 'Sports',
    eyebrow: 'Livescore & stats',
    title: 'Coverage that keeps up with the match.',
    description:
      'Live scores, possession, and tables standardized across African leagues — from grassroots to pro.',
    primaryCta: { label: 'Explore Data', to: '/livescore' },
    secondaryCta: { label: 'View Matches', to: '/matches' },
    metric: { label: 'Matches covered', value: '+24.5%' },
  },
  {
    id: 'stories',
    label: 'Stories',
    eyebrow: 'Editorial',
    title: 'Context behind every number.',
    description:
      'Match reports, analysis, and features that turn raw sports data into stories fans and teams can use.',
    primaryCta: { label: 'Read Stories', to: '/blogs' },
    secondaryCta: { label: 'Explore Data', to: '/livescore' },
    metric: { label: 'Articles published', value: '120+' },
  },
  {
    id: 'edtech',
    label: 'EdTech',
    eyebrow: 'Learning',
    title: 'Teach the game with real data.',
    description:
      'Quizzes, drills, and curriculum tools that help academies and schools build sports literacy.',
    primaryCta: { label: 'Play Quiz', to: '/quiz' },
    secondaryCta: { label: 'Contact Us', to: '/contact' },
    metric: { label: 'Learners engaged', value: '8K+' },
  },
  {
    id: 'fintech',
    label: 'FinTech',
    eyebrow: 'Sports finance',
    title: 'Payments and value around the pitch.',
    description:
      'Infrastructure for clubs and partners to manage fees, payouts, and sponsorship flows with confidence.',
    primaryCta: { label: 'Talk to Us', to: '/contact' },
    secondaryCta: { label: 'About Tisini', to: '/about' },
    metric: { label: 'Partner clubs', value: '200+' },
  },
  {
    id: 'tech',
    label: 'Tech',
    eyebrow: 'Platform',
    title: 'APIs and tools for builders.',
    description:
      'Clean sports data and integrations so products, media, and operators ship faster on a shared standard.',
    primaryCta: { label: 'Explore Solutions', to: '/about' },
    secondaryCta: { label: 'Contact Us', to: '/contact' },
    metric: { label: 'API uptime', value: '99.9%' },
  },
]

const companyStats = [
  { value: '15+', label: 'Tournaments' },
  { value: '5M+', label: 'Lives inspired' },
  { value: '3M+', label: 'Data points' },
  { value: '100%', label: 'Accuracy focus' },
  { value: '0', label: 'Latency lag' },
] as const

const liveMatch = {
  competition: 'KPL — Matchday 24',
  minute: "67'",
  home: { name: 'Gor Mahia', score: 1 },
  away: { name: 'AFC Leopards', score: 0 },
  possession: { home: 58, away: 42 },
}

const tableSnippet = [
  { pos: 1, team: 'Gor Mahia', pts: 54 },
  { pos: 2, team: 'Tusker FC', pts: 51 },
  { pos: 3, team: 'AFC Leopards', pts: 47 },
]

export function HeroSection() {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  const [reduceMotion, setReduceMotion] = React.useState(false)
  const [cycleKey, setCycleKey] = React.useState(0)
  const active = focuses[activeIndex]

  React.useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  React.useEffect(() => {
    if (paused || reduceMotion) return

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % focuses.length)
      setCycleKey((k) => k + 1)
    }, AUTO_ADVANCE_MS)

    return () => window.clearInterval(id)
  }, [paused, reduceMotion, cycleKey])

  const goTo = (index: number) => {
    setActiveIndex(index)
    setCycleKey((k) => k + 1)
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden border-b border-primary/10">
      {/* Full-bleed background — covers under the fixed header too */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "url('/abstract-technology-background-blue-2_J29O.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute top-10 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-24 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* pt-16 clears the fixed header; bg above stays full-bleed */}
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 pt-16 pb-10 sm:px-6 sm:pb-12 lg:pb-14">
        {/* Stable brand frame */}
        <div className="mx-auto mb-8 max-w-3xl text-center lg:mx-0 lg:max-w-none lg:text-left">
          <div className="mb-5 inline-flex items-center rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.15)] backdrop-blur-sm">
            <span
              aria-hidden="true"
              className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            />
            Tech platform for African impact
          </div>

          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Improving African lives using numbers
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg lg:mx-0">
            From live sports coverage to learning, stories, and tech — Tisini
            turns numbers into decisions that move communities forward.
          </p>
        </div>

        {/* Focus tabs + progress */}
        <div
          role="tablist"
          aria-label="Tisini focus areas"
          className="mb-10 flex flex-wrap items-center justify-center gap-2 lg:justify-start"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setPaused(false)
            }
          }}
        >
          {focuses.map((focus, index) => {
            const selected = index === activeIndex
            return (
              <button
                key={focus.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`focus-panel-${focus.id}`}
                id={`focus-tab-${focus.id}`}
                onClick={() => goTo(index)}
                className={cn(
                  'relative overflow-hidden rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-300',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                  selected
                    ? 'bg-white/10 text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]'
                    : 'bg-white/[0.03] text-foreground/65 hover:bg-white/10 hover:text-foreground',
                )}
              >
                <span className="relative z-10">{focus.label}</span>
                {selected && !reduceMotion && (
                  <span
                    key={cycleKey}
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 bottom-0 h-0.5 w-full origin-left bg-emerald-400',
                      paused
                        ? 'scale-x-0'
                        : 'animate-[hero-progress_linear_forwards]',
                    )}
                    style={
                      paused
                        ? undefined
                        : { animationDuration: `${AUTO_ADVANCE_MS}ms` }
                    }
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Rotating focus panel */}
        <div
          id={`focus-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`focus-tab-${active.id}`}
          className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            key={`copy-${active.id}-${cycleKey}`}
            className={cn(
              'flex flex-col items-center text-center lg:items-start lg:text-left',
              !reduceMotion && 'animate-[hero-fade-up_500ms_ease-out]',
            )}
          >
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              {active.eyebrow}
            </p>
            <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {active.title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              {active.description}
            </p>

            <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to={active.primaryCta.to as any}
                className={cn(
                  'inline-flex w-full items-center justify-center rounded-lg px-8 py-3.5 text-sm font-semibold sm:w-auto',
                  'bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(255,255,255,0.12)] transition-all hover:-translate-y-0.5 hover:bg-primary/90',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                )}
              >
                {active.primaryCta.label}
                <svg
                  className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>

              {active.secondaryCta && (
                <Link
                  to={active.secondaryCta.to as any}
                  className={cn(
                    'inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold backdrop-blur-sm sm:w-auto',
                    'text-primary transition-all hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
                  )}
                >
                  {active.secondaryCta.label}
                </Link>
              )}
            </div>

            <div className="mt-8 flex items-center gap-2" aria-hidden="true">
              {focuses.map((focus, index) => (
                <button
                  key={focus.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={cn(
                    'h-1.5 overflow-hidden rounded-full transition-all duration-300',
                    index === activeIndex
                      ? 'w-8 bg-white/15'
                      : 'w-1.5 bg-primary/30 hover:bg-primary/50',
                  )}
                  aria-label={`Go to ${focus.label}`}
                >
                  {index === activeIndex && !reduceMotion && (
                    <span
                      key={cycleKey}
                      className={cn(
                        'block h-full w-full origin-left bg-emerald-400',
                        paused
                          ? 'scale-x-0'
                          : 'animate-[hero-progress_linear_forwards]',
                      )}
                      style={
                        paused
                          ? undefined
                          : { animationDuration: `${AUTO_ADVANCE_MS}ms` }
                      }
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div
            key={`visual-${active.id}-${cycleKey}`}
            className={cn(
              !reduceMotion && 'animate-[hero-fade-in_550ms_ease-out]',
            )}
          >
            <FocusVisual focus={active} reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>

      {/* Stable company stats bar — full bleed, content constrained */}
      <div className="relative border-t border-white/10 bg-gradient-to-r from-white/[0.04] via-white/[0.07] to-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-7 sm:px-6 sm:py-8 lg:flex-row lg:items-center lg:gap-10">
          <div className="relative shrink-0 lg:max-w-[16rem] lg:border-r lg:border-white/15 lg:pr-10">
            <p className="font-heading text-xl font-bold tracking-tight text-emerald-300/90 sm:text-2xl lg:leading-snug">
              Trusted technology for Africa
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-white/10">
            {companyStats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'flex flex-col items-start px-0 sm:items-center sm:text-center lg:px-4',
                  !reduceMotion && 'animate-[hero-fade-up_600ms_ease-out]',
                )}
                style={
                  reduceMotion
                    ? undefined
                    : {
                        animationDelay: `${i * 60}ms`,
                        animationFillMode: 'both',
                      }
                }
              >
                <span className="font-heading text-2xl font-bold tracking-tight text-emerald-300 sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FocusVisual({
  focus,
  reduceMotion,
}: {
  focus: Focus
  reduceMotion: boolean
}) {
  return (
    <div className="relative hidden lg:block" aria-hidden="true">
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-transparent blur-2xl" />

      <div
        className={cn(
          'relative',
          !reduceMotion && 'animate-[hero-float_5s_ease-in-out_infinite]',
        )}
      >
        {focus.id === 'sports' ? (
          <SportsVisual />
        ) : (
          <GenericFocusCard focus={focus} />
        )}
      </div>

      <div
        className={cn(
          'absolute -bottom-5 -left-5 rounded-xl border border-emerald-400/25 bg-emerald-500/15 p-4 shadow-[0_12px_40px_rgba(16,185,129,0.25)] backdrop-blur-md',
          !reduceMotion &&
            'animate-[hero-float_4.5s_ease-in-out_infinite_reverse]',
        )}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/25 text-emerald-300 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.25)]">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs text-emerald-200/70">{focus.metric.label}</p>
            <p className="text-lg font-bold text-emerald-300">
              {focus.metric.value}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SportsVisual() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-2 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
      <div className="overflow-hidden rounded-xl border border-white/5 bg-background/90 shadow-inner">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.03] px-5 py-3">
          <span className="text-xs font-medium text-muted-foreground">
            {liveMatch.competition}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            LIVE {liveMatch.minute}
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 shadow-inner ring-1 ring-white/10" />
              <span className="text-xs text-muted-foreground">
                {liveMatch.home.name}
              </span>
            </div>
            <div className="flex items-center gap-3 font-heading text-3xl font-bold text-foreground">
              <span>{liveMatch.home.score}</span>
              <span className="text-muted-foreground/40">–</span>
              <span>{liveMatch.away.score}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 shadow-inner ring-1 ring-white/10" />
              <span className="text-xs text-muted-foreground">
                {liveMatch.away.name}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span>{liveMatch.possession.home}%</span>
              <span>Possession</span>
              <span>{liveMatch.possession.away}%</span>
            </div>
            <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] transition-[width] duration-700"
                style={{ width: `${liveMatch.possession.home}%` }}
              />
              <div
                className="bg-primary/40"
                style={{ width: `${liveMatch.possession.away}%` }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-1.5 border-t border-white/5 pt-4">
            {tableSnippet.map((row) => (
              <div key={row.pos} className="flex items-center gap-3 text-sm">
                <span className="w-4 text-xs text-muted-foreground">
                  {row.pos}
                </span>
                <span className="flex-1 text-foreground/90">{row.team}</span>
                <span className="font-semibold text-emerald-300">
                  {row.pts} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function GenericFocusCard({ focus }: { focus: Focus }) {
  const lines = {
    stories: ['Matchday briefing', 'Form guide', 'Player spotlight'],
    edtech: ['Quiz round 3', 'Accuracy 86%', 'Next: set pieces'],
    fintech: ['Club wallet', 'Payouts cleared', 'Sponsor split'],
    tech: ['GET /fixtures', '200 OK · 42ms', 'Webhook delivered'],
  } as const

  const items = lines[focus.id as Exclude<FocusId, 'sports'>]

  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] p-2 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
      <div className="overflow-hidden rounded-xl border border-white/5 bg-background/90 p-6 shadow-inner">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {focus.eyebrow}
          </span>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            {focus.label}
          </span>
        </div>

        <p className="font-heading text-xl font-bold text-foreground">
          {focus.title}
        </p>

        <ul className="mt-6 space-y-3">
          {items.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-foreground/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              style={{ animationDelay: `${120 + i * 80}ms` }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
