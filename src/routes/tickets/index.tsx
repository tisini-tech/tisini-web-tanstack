import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/tickets/')({
  head: () => ({
    meta: [
      { title: 'Tickets | Tisini' },
      {
        name: 'description',
        content: 'Tisini tickets are coming soon.',
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="page-shell-narrow text-foreground">
      <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
        <Link to="/" className="transition-colors hover:text-accent-foreground">
          Home
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-accent-foreground">Tickets</span>
      </nav>

      <p className="font-mono text-xs tracking-[0.2em] text-emerald-400/80 uppercase">
        Tickets
      </p>
      <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        We are coming soon
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        Match tickets on Tisini are on the way. Check back shortly.
      </p>
    </div>
  )
}
