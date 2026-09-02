import { Link } from '@tanstack/react-router'

export function AboutSection() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <section className="w-full max-w-3xl px-2 py-20 text-center sm:py-28">
        <p className="font-mono text-xs tracking-widest text-pitch uppercase dark:text-emerald-400/90 sm:text-sm">
          About
        </p>
        <h2 className="font-heading mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
          Built to improve African lives using numbers.
        </h2>
        <p className="mt-7 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl md:leading-relaxed">
          African sport and learning were full of passion but short on usable
          numbers. Coverage was fragmented, context was scarce, and too many
          decisions ran on instinct alone. We started by making performance
          data and match context available — then used those same numbers to
          teach, engage, and build habits people can bank.
        </p>
        <Link
          to="/about"
          className="mt-10 inline-flex items-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-5 py-2.5 font-mono text-sm tracking-wide text-accent-foreground uppercase transition-colors hover:bg-emerald-400/20"
        >
          Read our story
        </Link>
      </section>
    </main>
  )
}
