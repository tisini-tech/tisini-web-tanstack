import type { FixtureLineup } from '#/lib/types'
import { resolveMediaUrl } from '#/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'

/** Classic 4-4-2 by `lineupposition` (GK → attack). */
export const FORMATION_442: number[][] = [
  [1],
  [2, 4, 5, 3],
  [7, 6, 8, 11],
  [9, 10],
]

const ROW_LABELS = ['Goalkeeper', 'Defence', 'Midfield', 'Forwards'] as const

/**
 * Story:
 * team → big GK → big defence → big midfield → big forwards → full XI + coach & subs
 */
const T = {
  intro: 0,
  spotlight: 4_000,
  spotlightEach: 4_250,
  final: 4_000 + 4 * 4_250,
} as const

type Phase = 'intro' | 'spotlight' | 'final'

const PLACEHOLDER_COACH = {
  name: 'José Mourinho',
  title: 'Head Coach',
  image: '/jose-mourinho.jpg',
}

export function isSubstitute(player: FixtureLineup) {
  return (
    player.lineupposition === 1000 ||
    player.lineupposition == null ||
    player.player_type === 'sub'
  )
}

export function getStartersByPosition(players: FixtureLineup[]) {
  const byPos = new Map<number, FixtureLineup>()
  for (const player of players) {
    if (isSubstitute(player)) continue
    const pos = Number(player.lineupposition)
    if (pos >= 1 && pos <= 11) byPos.set(pos, player)
  }
  return byPos
}

export function getSubstitutes(players: FixtureLineup[]) {
  return players.filter(isSubstitute)
}

function displayName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '—'
  return parts[parts.length - 1]
}

function shortName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '—'
  if (parts.length === 1) return parts[0]
  return `${parts[0][0]}. ${parts[parts.length - 1]}`
}

type StreamTeamLineupProps = {
  teamName: string
  players: FixtureLineup[]
  teamLogo?: string | null
  leagueLogo?: string | null
  leagueName?: string | null
}

const easeOut = [0.22, 1, 0.36, 1] as const

/* No scale transforms — scaling photos during motion looks soft/blurry on stream. */
const chipVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOut },
  },
}

const rowEnter = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
}

type ChipSize = 'hero' | 'focus' | 'normal'

function PlayerChip({
  player,
  size = 'normal',
}: {
  player: FixtureLineup
  size?: ChipSize
}) {
  const surname = displayName(player.pname)
  const photo = resolveMediaUrl(player.passportphoto)

  const isHero = size === 'hero'
  const isFocus = size === 'focus'

  return (
    <div
      className={
        isHero
          ? 'flex w-[14rem] flex-col items-center gap-2 sm:w-[16rem] lg:w-[18rem]'
          : isFocus
            ? 'flex w-[11rem] flex-col items-center gap-2 sm:w-[12.5rem] lg:w-[14rem]'
            : 'flex w-[7.25rem] flex-col items-center gap-1.5 sm:w-[8rem] lg:w-[8.75rem]'
      }
    >
      <div className="relative">
        <div
          className={
            isHero
              ? 'flex h-[18rem] w-[14rem] items-center justify-center overflow-hidden rounded-2xl bg-[#0a1f4d] shadow-2xl ring-[3px] ring-white sm:h-[20rem] sm:w-[16rem] lg:h-[22rem] lg:w-[18rem]'
              : isFocus
                ? 'flex h-[14rem] w-[11rem] items-center justify-center overflow-hidden rounded-2xl bg-[#0a1f4d] shadow-2xl ring-[3px] ring-white sm:h-[15.5rem] sm:w-[12.5rem] lg:h-[17rem] lg:w-[14rem]'
                : 'flex h-[7.25rem] w-[6.25rem] items-center justify-center overflow-hidden rounded-xl bg-[#0a1f4d] shadow-lg ring-2 ring-white/90 sm:h-[8rem] sm:w-[7rem] lg:h-[8.75rem] lg:w-[7.75rem]'
          }
        >
          {photo ? (
            <img
              src={photo}
              alt={player.pname}
              decoding="async"
              draggable={false}
              className="h-full w-full object-cover object-[center_15%]"
            />
          ) : (
            <span
              className={
                isHero
                  ? 'text-7xl font-extrabold text-white/90 sm:text-8xl'
                  : isFocus
                    ? 'text-5xl font-extrabold text-white/90 sm:text-6xl lg:text-7xl'
                    : 'text-3xl font-extrabold text-white/90 sm:text-4xl'
              }
            >
              {player.jersey_no}
            </span>
          )}
        </div>
        {photo ? (
          <span
            className={
              isHero
                ? 'absolute -right-2 -bottom-2 flex h-12 min-w-12 items-center justify-center rounded-lg bg-[#023270] px-2 text-2xl font-extrabold text-white shadow-lg ring-2 ring-white'
                : isFocus
                  ? 'absolute -right-2 -bottom-2 flex h-11 min-w-11 items-center justify-center rounded-lg bg-[#023270] px-1.5 text-xl font-extrabold text-white shadow-lg ring-2 ring-white'
                  : 'absolute -right-1.5 -bottom-1.5 flex h-8 min-w-8 items-center justify-center rounded-md bg-[#023270] px-1 text-base font-extrabold text-white shadow-md ring-2 ring-white'
            }
          >
            {player.jersey_no}
          </span>
        ) : null}
      </div>
      <span
        title={player.pname}
        className={
          isHero
            ? 'w-full rounded-lg bg-[#023270] px-2 py-2.5 text-center text-lg leading-tight font-extrabold tracking-wide text-white uppercase shadow-md sm:text-xl'
            : isFocus
              ? 'w-full rounded-lg bg-[#023270] px-2 py-2 text-center text-sm leading-tight font-extrabold tracking-wide text-white uppercase shadow-md sm:text-base'
              : 'w-full rounded-md bg-[#023270] px-1.5 py-1.5 text-center text-xs leading-tight font-bold tracking-wide text-white uppercase shadow-sm sm:text-sm'
        }
      >
        <span className="line-clamp-2 break-words">{surname}</span>
      </span>
    </div>
  )
}

function PitchSurface({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #2a9b5c 0%, #1e7a48 50%, #16663a 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0, transparent 28px, rgba(255,255,255,0.08) 28px, rgba(255,255,255,0.08) 56px)',
        }}
      />
      <div className="pointer-events-none absolute inset-3 rounded-lg border-2 border-white/40 sm:inset-4">
        <div className="absolute top-0 left-1/2 h-[14%] w-[38%] -translate-x-1/2 border-2 border-t-0 border-white/40" />
        <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-white/40" />
        <div className="absolute top-1/2 left-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40 sm:h-16 sm:w-16" />
        <div className="absolute bottom-0 left-1/2 h-[14%] w-[38%] -translate-x-1/2 border-2 border-b-0 border-white/40" />
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

export function StreamTeamLineup({
  teamName,
  players,
  teamLogo,
  leagueLogo,
  leagueName,
}: StreamTeamLineupProps) {
  const [playKey, setPlayKey] = useState(0)
  const [phase, setPhase] = useState<Phase>('intro')
  const [spotlightRow, setSpotlightRow] = useState<number | null>(null)

  const starters = getStartersByPosition(players)
  const substitutes = getSubstitutes(players).slice(0, 14)
  const leagueLabel =
    leagueName && !/^\d+$/.test(leagueName.trim()) ? leagueName : null

  const teamLogoSrc = resolveMediaUrl(teamLogo) || '/homeLogo.png'
  const leagueLogoSrc =
    resolveMediaUrl(leagueLogo) || '/league-logo-placeholder.svg'

  const showPitch = phase === 'spotlight' || phase === 'final'
  const showRail = phase === 'final'
  const isSpotlight = phase === 'spotlight'
  const showFullXi = phase === 'final'

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' && event.key !== ' ') return
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      event.preventDefault()
      setPlayKey((key) => key + 1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    setPhase('intro')
    setSpotlightRow(null)
    const timers: number[] = []

    timers.push(
      window.setTimeout(() => {
        setPhase('spotlight')
        setSpotlightRow(0)
      }, T.spotlight),
    )

    for (let i = 1; i < ROW_LABELS.length; i++) {
      timers.push(
        window.setTimeout(
          () => setSpotlightRow(i),
          T.spotlight + i * T.spotlightEach,
        ),
      )
    }

    timers.push(
      window.setTimeout(() => {
        setSpotlightRow(null)
        setPhase('final')
      }, T.final),
    )

    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [playKey])

  return (
    <div className="box-border flex h-screen w-screen items-stretch justify-stretch p-2 sm:p-3">
      <motion.article
        key={playKey}
        className="relative flex h-full w-full min-h-0 flex-col overflow-hidden rounded-xl bg-[#023270] text-white shadow-2xl sm:rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: easeOut }}
      >
        <AnimatePresence mode="wait">
          {/* 1. Team only — coach comes later with the rail */}
          {phase === 'intro' ? (
            <motion.div
              key="intro"
              className="relative flex h-full min-h-0 flex-col items-center justify-center gap-6 overflow-hidden px-8 py-8 sm:px-12 sm:py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <motion.img
                src={teamLogoSrc}
                alt={teamName}
                className="h-28 w-28 rounded-full bg-white object-contain p-2.5 shadow-2xl sm:h-36 sm:w-36 md:h-40 md:w-40"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut }}
              />
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOut, delay: 0.12 }}
              >
                <p className="text-sm font-semibold tracking-[0.28em] text-[#7eb6ff] uppercase sm:text-base">
                  Starting XI · 4-4-2
                </p>
                <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-wide text-white uppercase sm:text-5xl md:text-6xl lg:text-7xl">
                  {teamName}
                </h1>
              </motion.div>
            </motion.div>
          ) : null}

          {/* 2–4. Pitch column + rail from top */}
          {showPitch ? (
            <motion.div
              key="match-layout"
              className="flex h-full min-h-0 flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              {/* Left: logos + pitch (header only spans this column) */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center gap-6 border-b border-white/10 px-5 py-4 sm:gap-10 sm:px-8 sm:py-5">
                  <img
                    src={leagueLogoSrc}
                    alt={leagueLabel || 'League'}
                    className="h-14 w-14 shrink-0 rounded-full bg-white object-contain p-1.5 shadow-md sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                  />
                  <div className="min-w-0 flex-1 text-center">
                    <p className="text-xs font-semibold tracking-[0.22em] text-[#7eb6ff] uppercase sm:text-sm">
                      Starting XI · 4-4-2
                    </p>
                    <h2 className="truncate font-heading text-2xl font-extrabold text-white uppercase sm:text-3xl lg:text-4xl">
                      {teamName}
                    </h2>
                  </div>
                  <img
                    src={teamLogoSrc}
                    alt={teamName}
                    className="h-14 w-14 shrink-0 rounded-full bg-white object-contain p-1.5 shadow-md sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                  />
                </div>

                <motion.div
                  layout
                  className="relative m-2 min-h-0 flex-1 sm:m-3 lg:m-4"
                  transition={{ duration: 0.65, ease: easeOut }}
                >
                  <PitchSurface>
                    <div className="relative flex h-full min-h-0">
                      {/* Big vertical unit label during spotlight */}
                      <AnimatePresence mode="wait">
                        {isSpotlight && spotlightRow !== null ? (
                          <motion.div
                            key={ROW_LABELS[spotlightRow]}
                            className="flex w-12 shrink-0 items-center justify-center border-r border-white/15 bg-[#023270]/35 sm:w-16 lg:w-20"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.35, ease: easeOut }}
                          >
                            <span className="font-heading text-3xl font-extrabold tracking-[0.28em] text-white uppercase sm:text-4xl lg:text-5xl [writing-mode:vertical-rl] rotate-180">
                              {ROW_LABELS[spotlightRow]}
                            </span>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>

                      <div
                        className={
                          isSpotlight
                            ? 'flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-3 sm:px-4 sm:py-4'
                            : 'flex h-full flex-1 flex-col justify-between px-2 py-4 sm:px-4 sm:py-5 lg:py-6'
                        }
                      >
                        {FORMATION_442.map((row, rowIndex) => {
                          const isActive = spotlightRow === rowIndex
                          // Spotlight: only the active unit — no full XI underneath
                          if (isSpotlight && !isActive) return null

                          const spotlightFocus = isSpotlight && isActive
                          const chipSize: ChipSize = spotlightFocus
                            ? row.length <= 2
                              ? 'hero'
                              : 'focus'
                            : 'normal'

                          return (
                            <div
                              key={row.join('-')}
                              className={
                                spotlightFocus
                                  ? 'relative z-20 flex w-full max-w-none items-center justify-evenly gap-2 px-1 sm:gap-3 sm:px-2'
                                  : 'relative flex w-full flex-1 items-center justify-evenly gap-1 sm:gap-2'
                              }
                            >
                              {row.map((pos, posIndex) => {
                                const player = starters.get(pos)
                                if (!player) {
                                  return (
                                    <motion.div
                                      key={pos}
                                      initial={{ opacity: 0, y: 14 }}
                                      animate={{ opacity: 0.35, y: 0 }}
                                      transition={{
                                        duration: 0.4,
                                        ease: easeOut,
                                      }}
                                    >
                                      <div className="flex h-16 w-14 items-center justify-center rounded-lg border-2 border-dashed border-white/50 text-white">
                                        {pos}
                                      </div>
                                    </motion.div>
                                  )
                                }

                                return (
                                  <motion.div
                                    key={player.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: 0.45,
                                      ease: easeOut,
                                      delay: showFullXi
                                        ? rowIndex * 0.08 + posIndex * 0.05
                                        : posIndex * 0.08,
                                    }}
                                  >
                                    <PlayerChip
                                      player={player}
                                      size={chipSize}
                                    />
                                  </motion.div>
                                )
                              })}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </PitchSurface>
                </motion.div>
              </div>

              {/* Rail from top of card — coach gets more presence */}
              <AnimatePresence>
                {showRail ? (
                  <motion.aside
                    key="rail"
                    className="flex h-full min-h-0 w-[18rem] shrink-0 flex-col border-l border-white/10 px-4 py-4 sm:w-[21rem] sm:px-5 sm:py-5 lg:w-[24rem] lg:px-6"
                    initial={{ opacity: 0, x: 48, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: 'auto' }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.65, ease: easeOut }}
                  >
                    <motion.div
                      className="mb-5 flex shrink-0 flex-col items-center border-b border-white/10 pb-5 text-center"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      <img
                        src={PLACEHOLDER_COACH.image}
                        alt={PLACEHOLDER_COACH.name}
                        className="h-36 w-36 rounded-2xl object-cover shadow-lg ring-2 ring-white/30 sm:h-40 sm:w-40 lg:h-44 lg:w-44"
                      />
                      <p className="mt-3 text-xs tracking-[0.18em] text-white/55 uppercase sm:text-sm">
                        {PLACEHOLDER_COACH.title}
                      </p>
                      <p className="mt-1 text-xl font-bold text-white sm:text-2xl">
                        {PLACEHOLDER_COACH.name}
                      </p>
                    </motion.div>

                    <p className="mb-3 shrink-0 text-xs font-bold tracking-[0.18em] text-[#7eb6ff] uppercase sm:text-sm">
                      Substitutes
                    </p>

                    <motion.ul
                      className="min-h-0 flex-1 space-y-2 overflow-hidden pr-0.5"
                      variants={rowEnter}
                      initial="hidden"
                      animate="show"
                    >
                      {substitutes.length === 0 ? (
                        <li className="text-sm text-white/45">None listed</li>
                      ) : (
                        substitutes.map((player) => (
                          <motion.li
                            key={player.id}
                            variants={chipVariants}
                            title={player.pname}
                          >
                            <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[#1E6FD9] px-3.5 py-1.5 text-sm font-semibold text-white sm:text-base">
                              <span className="tabular-nums text-yellow-200">
                                {player.jersey_no}
                              </span>
                              <span className="truncate">
                                {shortName(player.pname)}
                              </span>
                            </span>
                          </motion.li>
                        ))
                      )}
                    </motion.ul>

                    <motion.div
                      className="mt-3 flex shrink-0 flex-col items-center gap-1 border-t border-white/10 pt-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                    >
                      <span className="text-sm font-semibold text-white/80 italic">
                        Insights by
                      </span>
                      <img
                        src="/tisini-logo.png"
                        alt="Tisini"
                        className="h-10 w-auto object-contain sm:h-11"
                      />
                    </motion.div>
                  </motion.aside>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.article>
    </div>
  )
}
