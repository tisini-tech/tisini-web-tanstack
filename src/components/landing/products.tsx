import { Link } from '@tanstack/react-router'

type ProductBucket = {
  name: string
  summary: string
  items: string[]
  cta: { label: string; to: string }
}

const buckets: ProductBucket[] = [
  {
    name: 'Sports intelligence',
    summary:
      'Livescores, tournament coverage, and stories that turn match data into context fans and teams can use.',
    items: ['Livescores', 'Tournament coverage', 'Articles & analysis'],
    cta: { label: 'Read articles', to: '/articles' },
  },
  {
    name: 'Engagement',
    summary:
      'Quizzes, Tano Bora, and surveys that keep fans learning, competing, and coming back.',
    items: ['Quiz', 'Tano Bora', 'Surveys'],
    cta: { label: 'Play quiz', to: '/quiz/GN88FDHhWw7n' },
  },
  {
    name: 'Operations',
    summary:
      'Tools for clubs and organizers — manage competitions and move people through the gate.',
    items: ['Tisini management system', 'Ticketing'],
    cta: { label: 'Talk to us', to: '/contact' },
  },
  {
    name: 'Build with us',
    summary:
      'Custom web design and digital builds for federations, clubs, and partners who need a sharper presence.',
    items: ['Web design'],
    cta: { label: 'Start a project', to: '/contact' },
  },
]

export function ProductsSection() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <section className="w-full py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs tracking-widest text-emerald-400/90 uppercase sm:text-sm">
            What we build
          </p>
          <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            One platform. Four ways we show up.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            From live numbers and stories to engagement, operations, and custom
            builds — products that improve African lives using data.
          </p>
        </div>

        <div className="mt-12 grid gap-0 border-t border-white/10 sm:grid-cols-2">
          {buckets.map((bucket) => (
            <div
              key={bucket.name}
              className="border-b border-white/10 px-1 py-8 sm:px-6 sm:odd:border-r lg:px-8"
            >
              <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {bucket.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {bucket.summary}
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] tracking-wide text-emerald-300/80 uppercase">
                {bucket.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link
                to={bucket.cta.to as any}
                className="mt-5 inline-flex text-sm text-emerald-300 transition-colors hover:text-emerald-200"
              >
                {bucket.cta.label} →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
