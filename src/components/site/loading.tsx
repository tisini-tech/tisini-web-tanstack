import { motion, useReducedMotion } from 'framer-motion'

const easeOut = [0.22, 1, 0.36, 1] as const

const pulse = [0, 1, 2] as const

export default function Loading() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="relative flex flex-1 flex-col justify-center overflow-hidden bg-background text-foreground"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/12 via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '3rem 3rem',
          maskImage:
            'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[800px] flex-col items-start px-4 py-16 sm:px-6 sm:py-20">
        <motion.p
          className="font-mono text-xs tracking-[0.2em] text-emerald-400/80 uppercase"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOut }}
        >
          Loading
        </motion.p>

        <motion.div
          className="mt-6 flex items-end gap-2"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.08 }}
          aria-hidden
        >
          {pulse.map((i) => (
            <motion.span
              key={i}
              className="font-heading text-[clamp(3.5rem,14vw,6rem)] leading-none font-bold tracking-tighter text-foreground/15"
              animate={
                reduceMotion
                  ? { opacity: 0.15 }
                  : { opacity: [0.12, 0.45, 0.12], y: [0, -4, 0] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 1.35,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      delay: i * 0.18,
                    }
              }
            >
              {i === 0 ? '0' : i === 1 ? '1' : '—'}
            </motion.span>
          ))}
        </motion.div>

        <motion.h1
          className="font-heading mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.16 }}
        >
          Gathering the numbers
        </motion.h1>

        <motion.p
          className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.24 }}
        >
          Pulling the latest signals so African sport stays clear, fast, and
          useful.
        </motion.p>

        <motion.div
          className="mt-10 h-1 w-40 overflow-hidden rounded-full bg-border"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          aria-hidden
        >
          <motion.div
            className="h-full w-1/2 rounded-full bg-emerald-400/80"
            animate={
              reduceMotion
                ? { x: '50%' }
                : { x: ['-100%', '200%'] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1.4,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  }
            }
          />
        </motion.div>

        <span className="sr-only">Loading content, please wait.</span>
      </div>
    </div>
  )
}
