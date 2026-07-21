// src/routes/index.tsx
import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { SiteHeader } from "@/components/site/header"
import { HeroSection } from "#/components/landing/hero"
import { AboutSection } from "#/components/landing/about"
import { BlogsSection } from "#/components/landing/blogs"
import { ContactsSection } from "#/components/landing/contacts"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/")({
  component: Home,
})

const slides = [
  { id: "hero", component: HeroSection },
  { id: "blogs", component: BlogsSection },
  { id: "about", component: AboutSection },
  { id: "contacts", component: ContactsSection },
]

function Home() {
  const [activeSection, setActiveSection] = React.useState("hero")
  const sectionRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())

  // Scroll spy: which section is in the viewport?
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 }
    )

    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = sectionRefs.current.get(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    // overflow-x-hidden added here: clips any stray horizontal overflow
    <div className="relative h-screen w-full overflow-hidden overflow-x-hidden bg-background">
      {/* ─── Persistent Hero Background ─── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                               linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "3rem 3rem",
          }}
        />
      </div>

      {/* ─── Header ─── */}
      <SiteHeader activeSection={activeSection} onNavigate={scrollTo} />

      {/* ─── Carousel / Snap Scroll ─── */}
      <div
        className="h-full snap-y snap-proximity overflow-y-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {slides.map(({ id, component: Section }) => (
          <section
            key={id}
            id={id}
            ref={(el) => {
              if (el) sectionRefs.current.set(id, el as HTMLDivElement)
            }}
            className="relative z-10 flex min-h-screen snap-start flex-col items-center justify-center px-4 pt-16"
          >
            <div className="w-full max-w-7xl">
              <Section />
            </div>
          </section>
        ))}
        <div id="footer" className="relative z-10 snap-start">
        
        </div>
      </div>

      {/* ─── Side Dot Navigation (desktop only) ─── */}
      <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {slides.map((s) => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={cn(
              "w-2 rounded-full transition-all duration-300",
              activeSection === s.id ? "h-8 bg-primary" : "h-2 bg-primary/30 hover:bg-primary/50"
            )}
            aria-label={`Scroll to ${s.id}`}
          />
        ))}
      </div>
    </div>
  )
}