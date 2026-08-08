import { createFileRoute } from "@tanstack/react-router"


export const Route = createFileRoute("/")({
  component: AboutSection,
  head: () => ({
    meta: [
      { title: "About | Tisini" },
      {
        name: "description",
        content: "Learn about Tisini — improving African lives using numbers through technology and data analytics.",
      },
    ],
  }),
})

interface StatItem {
  number: string
  label: string
}

interface FocusArea {
  name: string
  detail: string
}

const stats: StatItem[] = [
  { number: "6000+", label: "Wallet Accounts" },
  { number: "3+", label: "Sports Covered" },
  { number: "100%", label: "Data Accuracy" },
]

const focusAreas: FocusArea[] = [
  { name: "Sport", detail: "We build tech that surfaces the numbers behind performance, for individuals and teams." },
  { name: "Education", detail: "We make learning in schools practical, engaging, and fun, using numbers." },
  { name: "Data Analytics", detail: "We help businesses and organizations make data-driven decisions with clear insight." },
  { name: "Finance", detail: "The Tisini Wallet makes your good habits bankable." },
]

export function AboutSection() {
  return (
    <main className="flex-1">
      <section className="w-full py-20 sm:py-28">
        {/* ─── Mission: stated once, directly, left-aligned ─── */}
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-emerald-400/90">MISSION</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Tisini is a tech company built to improve African lives using numbers.
          </h1>
        </div>

        {/* ─── Focus areas: a divider list, not a wall of headers ─── */}
        <div className="mt-20 border-t border-white/10">
          <p className="mt-8 font-mono text-xs tracking-widest text-gray-500">WHERE WE'VE STARTED</p>
          <dl className="mt-2">
            {focusAreas.map((area) => (
              <div
                key={area.name}
                className="grid gap-2 border-t border-white/10 py-6 sm:grid-cols-4 sm:gap-8"
              >
                <dt className="font-semibold text-white sm:col-span-1">{area.name}</dt>
                <dd className="text-base leading-7 text-blue-100 sm:col-span-3">{area.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ─── Numbers: one strip─── */}
        <div className="mt-20 grid divide-y divide-white/10 border-t border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="py-8 text-center sm:py-10">
              <div className="text-4xl font-bold text-white sm:text-5xl">{stat.number}</div>
              <div className="mt-2 font-mono text-xs tracking-widest text-gray-500">
                {stat.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}