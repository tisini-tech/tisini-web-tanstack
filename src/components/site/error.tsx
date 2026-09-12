import { Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'

const easeOut = [0.22, 1, 0.36, 1] as const

export default function ErrorPage({ error, reset }: ErrorComponentProps) {
  const reduceMotion = useReducedMotion()
  const message =
    error instanceof Error && error.message
      ? error.message
      : 'Something unexpected went wrong.'

  const fadeUp = (delay = 0) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: easeOut, delay },
        }

  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden bg-background text-foreground">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-destructive/10 via-background to-background"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '3rem 3rem',
          maskImage:
            'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
        initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 0.035, scale: 1 }}
        transition={{ duration: 1.1, ease: easeOut }}
      />

      <div className="relative mx-auto flex w-full max-w-[800px] flex-col px-4 py-16 sm:px-6 sm:py-20">
        <motion.p
          className="font-mono text-xs tracking-[0.2em] text-destructive/80 uppercase"
          {...fadeUp(0.05)}
        >
          Temporary setback
        </motion.p>

        <motion.p
          aria-hidden
          className="font-heading mt-4 text-[clamp(5.5rem,22vw,9rem)] leading-none font-bold tracking-tighter text-foreground/10 select-none"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 24 }}
          animate={
            reduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  y: [0, -6, 0],
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  opacity: { duration: 0.6, ease: easeOut, delay: 0.1 },
                  scale: { duration: 0.7, ease: easeOut, delay: 0.1 },
                  y: {
                    duration: 5.5,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: 0.9,
                  },
                }
          }
        >
          Err
        </motion.p>

        <motion.h1
          className="font-heading -mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
          {...fadeUp(0.22)}
        >
          The numbers hit a snag
        </motion.h1>

        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          {...fadeUp(0.32)}
        >
          Tisini turns sports data into progress for African lives. This screen
          is a pause — not the final whistle. Try again, or head somewhere
          useful while we recover.
        </motion.p>

        <motion.div
          role="alert"
          className="mt-8 rounded-lg border border-border bg-muted/40 px-4 py-3 font-mono text-sm text-muted-foreground"
          {...fadeUp(0.4)}
        >
          <span className="text-xs tracking-widest text-muted-foreground/70 uppercase">
            Detail
          </span>
          <p className="mt-1 break-words text-foreground/80">{message}</p>
        </motion.div>

        <motion.div className="mt-10 flex flex-wrap gap-3" {...fadeUp(0.5)}>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-5 py-2.5 font-mono text-sm tracking-wide text-accent-foreground uppercase transition-colors hover:bg-emerald-400/20"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 font-mono text-sm tracking-wide text-muted-foreground uppercase transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            Back home
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 font-mono text-sm tracking-wide text-muted-foreground uppercase transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            About Tisini
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
