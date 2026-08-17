import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About | Tisini' },
      {
        name: 'description',
        content:
          'How Tisini started with African sports data and grew into stories, learning, and habits people can bank — improving lives using numbers.',
      },
    ],
  }),
  component: AboutPage,
})

const chapters = [
  {
    name: 'Sport',
    detail:
      'We began where the signal was loudest: matches, performance, and leagues that deserved clearer numbers. Livescores, tables, and stats made African sport easier to follow and harder to ignore.',
  },
  {
    name: 'Stories',
    detail:
      'Data alone is not enough. Editorial context — match reports, features, and analysis — turns raw numbers into understanding fans, coaches, and communities can act on.',
  },
  {
    name: 'Education',
    detail:
      'The same numbers became teaching tools. Quizzes, drills, and learning products make sports literacy practical for schools, academies, and curious fans.',
  },
  {
    name: 'Finance',
    detail:
      'Good habits should compound. The Tisini Wallet connects everyday actions to value — making progress bankable, not just measurable.',
  },
] as const

const stats = [
  { number: '6000+', label: 'Wallet accounts' },
  { number: '3+', label: 'Sports covered' },
  { number: '100%', label: 'Data accuracy' },
] as const

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[800px] px-4 pt-24 pb-20 sm:px-6">
        <nav className="mb-8 flex flex-wrap items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground uppercase">
          <Link to="/" className="transition-colors hover:text-emerald-300">
            Home
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-emerald-300">About</span>
        </nav>

        <p className="font-mono text-xs tracking-[0.2em] text-emerald-400/80 uppercase">
          Our story
        </p>
        <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Improving African lives using numbers
        </h1>

        <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            African sport and learning were full of passion but short on usable
            numbers. Coverage was fragmented. Context was scarce. Decisions — on
            the pitch, in classrooms, and in everyday habits — often ran on
            instinct alone.
          </p>
          <p>
            Tisini started by making performance data and match context
            available: clearer scores, tables, and signals across the leagues
            and communities we care about. From there, the same numbers became
            stories people could read, tools people could learn from, and habits
            people could bank.
          </p>
          <p className="text-foreground/90">
            We are a tech company. Our through-line is simple — turn numbers
            into progress that improves African lives.
          </p>
        </div>

        <section className="mt-16 border-t border-white/10 pt-10">
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
            How the story unfolded
          </p>
          <dl className="mt-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.name}
                className="grid gap-2 border-t border-white/10 py-6 sm:grid-cols-4 sm:gap-8"
              >
                <dt className="font-heading text-sm font-semibold tracking-wide text-emerald-300 uppercase sm:col-span-1">
                  {chapter.name}
                </dt>
                <dd className="text-base leading-relaxed text-muted-foreground sm:col-span-3">
                  {chapter.detail}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10 grid divide-y divide-white/10 border-t border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="py-8 text-center sm:py-10">
              <div className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                {stat.number}
              </div>
              <div className="mt-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        <div className="mt-14 flex flex-wrap gap-3 border-t border-white/10 pt-10">
          <Link
            to="/articles"
            className="inline-flex items-center rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-5 py-2.5 font-mono text-sm tracking-wide text-emerald-300 uppercase transition-colors hover:bg-emerald-400/20"
          >
            Read articles
          </Link>
          {/* <Link
            to="/contact"
            className="inline-flex items-center rounded-lg border border-white/15 px-5 py-2.5 font-mono text-sm tracking-wide text-muted-foreground uppercase transition-colors hover:border-white/25 hover:text-foreground"
          >
            Contact us
          </Link> */}
        </div>
      </div>
    </div>
  )
}
