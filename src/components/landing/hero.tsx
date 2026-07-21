import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

interface HeroProps {
  badge?: string
  headline: string
  subheadline: string
  primaryCta: { label: string; to: string }
  secondaryCta?: { label: string; to: string }
  socialProof?: string
}

// Live match and table snippet are hardcoded for now, but could be
// fetched from an API in the future.
const liveMatch = {
  competition: "KPL — Matchday 24",
  minute: "67'",
  home: { name: "Gor Mahia", score: 1 },
  away: { name: "AFC Leopards", score: 0 },
  possession: { home: 58, away: 42 },
}

const tableSnippet = [
  { pos: 1, team: "Gor Mahia", pts: 54 },
  { pos: 2, team: "Tusker FC", pts: 51 },
  { pos: 3, team: "AFC Leopards", pts: 47 },
]

export function HeroSection({
  badge = "Now covering 3+ sports",
  headline = "Numbers that change the game",
  subheadline = "Tisini standardizes sports data across Africa — from grassroots football to pro basketball — so teams, analysts, and fans can make smarter decisions.",
  primaryCta = { label: "Explore Data", to: "/livescore" },
  secondaryCta = { label: "Read Stories", to: "/blogs" },
  socialProof = "50K+ terms defined · 4 sports · 100% accuracy",
}: Partial<HeroProps>) {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden border-b border-primary/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "url('./abstract-technology-background-blue-2_J29O.png')" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
              <span aria-hidden="true" className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              {badge}
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
              {headline}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">{subheadline}</p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                to={primaryCta.to}
                className={cn(
                  "inline-flex w-full items-center justify-center rounded-lg px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors sm:w-auto",
                  "bg-primary hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                {primaryCta.label}
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              {secondaryCta && (
                <Link
                  to={secondaryCta.to}
                  className={cn(
                    "inline-flex w-full items-center justify-center rounded-lg border border-primary/20 px-8 py-3.5 text-sm font-semibold transition-colors sm:w-auto",
                    "text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  )}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>

            {/* Social proof */}
            {socialProof && (
              <p className="mt-10 text-sm text-muted-foreground">{socialProof}</p>
            )}
          </div>

          {/* ─── Right: Live match panel — real product content ─── */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="relative rounded-2xl border border-primary/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm">
              <div className="overflow-hidden rounded-xl bg-background/80">
                {/* Panel header */}
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
                  <span className="text-xs font-medium text-muted-foreground">{liveMatch.competition}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE {liveMatch.minute}
                  </span>
                </div>

                {/* Scoreline */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20" />
                      <span className="text-xs text-muted-foreground">{liveMatch.home.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-3xl font-bold text-foreground">
                      <span>{liveMatch.home.score}</span>
                      <span className="text-muted-foreground/40">–</span>
                      <span>{liveMatch.away.score}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20" />
                      <span className="text-xs text-muted-foreground">{liveMatch.away.name}</span>
                    </div>
                  </div>

                  {/* Possession bar — real stat*/}
                  <div className="mt-6">
                    <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                      <span>{liveMatch.possession.home}%</span>
                      <span>Possession</span>
                      <span>{liveMatch.possession.away}%</span>
                    </div>
                    <div className="flex h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="bg-emerald-500" style={{ width: `${liveMatch.possession.home}%` }} />
                      <div className="bg-primary/40" style={{ width: `${liveMatch.possession.away}%` }} />
                    </div>
                  </div>

                  {/* Table snippet the match feeds into */}
                  <div className="mt-6 space-y-1.5 border-t border-white/5 pt-4">
                    {tableSnippet.map((row) => (
                      <div key={row.pos} className="flex items-center gap-3 text-sm">
                        <span className="w-4 text-xs text-muted-foreground">{row.pos}</span>
                        <span className="flex-1 text-foreground/90">{row.team}</span>
                        <span className="font-semibold text-primary">{row.pts} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-emerald-200/70">Matches Covered</p>
                  <p className="text-lg font-bold text-emerald-400">+24.5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}