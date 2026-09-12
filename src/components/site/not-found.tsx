import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'

const shortcuts = [
  { to: '/livescores', label: 'Livescores' },
  { to: '/articles', label: 'Articles' },
  { to: '/about', label: 'About' },
] as const

const easeOut = [0.22, 1, 0.36, 1] as const

export default function NotFoundPage() {
  const reduceMotion = useReducedMotion()

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/12 via-background to-background"
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
          className="font-mono text-xs tracking-[0.2em] text-emerald-400/80 uppercase"
          {...fadeUp(0.05)}
        >
          Page not found
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
          404
        </motion.p>

        <motion.h1
          className="font-heading -mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
          {...fadeUp(0.22)}
        >
          This path is off the pitch
        </motion.h1>

        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          {...fadeUp(0.32)}
        >
          Tisini inspires African lives using numbers — starting with sports.
          The page you asked for isn&apos;t in our data. Head home, or pick up
          the trail below.
        </motion.p>

        <motion.div className="mt-10 flex flex-wrap gap-3" {...fadeUp(0.42)}>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-5 py-2.5 font-mono text-sm tracking-wide text-accent-foreground uppercase transition-colors hover:bg-emerald-400/20"
          >
            Back home
          </Link>
          <Link
            to="/livescores"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 font-mono text-sm tracking-wide text-muted-foreground uppercase transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            Check livescores
          </Link>
        </motion.div>

        <motion.div
          className="mt-14 border-t border-border pt-8"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.55 }}
        >
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Keep exploring
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {shortcuts.map((item, index) => (
              <motion.li
                key={item.to}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: easeOut,
                  delay: 0.62 + index * 0.07,
                }}
              >
                <Link
                  to={item.to}
                  className="font-heading text-sm font-semibold tracking-wide text-foreground/80 uppercase transition-colors hover:text-accent-foreground"
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
