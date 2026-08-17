// src/routes/index.tsx
import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { SiteHeader } from '@/components/site/header'
import { HeroSection } from '#/components/landing/hero'
import { AboutSection } from '#/components/landing/about'
import { ProductsSection } from '#/components/landing/products'
import { ContactsSection } from '#/components/landing/contacts'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

const slides = [
  { id: 'hero', label: 'Home', component: HeroSection },
  { id: 'about', label: 'About', component: AboutSection },
  { id: 'products', label: 'Products', component: ProductsSection },
  { id: 'contacts', label: 'Contact', component: ContactsSection },
] as const

function Home() {
  const [activeSection, setActiveSection] = React.useState('hero')
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
      { threshold: 0.5 },
    )

    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    const el = sectionRefs.current.get(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  React.useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (!hash) return
    // Wait a tick so section refs are populated
    requestAnimationFrame(() => scrollTo(hash))
  }, [])

  return (
    <div className="relative h-screen w-full overflow-x-hidden bg-background">
      {/* ─── Persistent page background (non-hero slides) ─── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                               linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '3rem 3rem',
          }}
        />
      </div>

      {/* ─── Header ─── */}
      <SiteHeader activeSection={activeSection} onNavigate={scrollTo} />

      {/* ─── Carousel / Snap Scroll ─── */}
      <div
        className={cn(
          'relative z-10 h-full snap-y snap-proximity overflow-y-auto scroll-smooth',
          '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {slides.map(({ id, component: Section }) => (
          <section
            key={id}
            id={id}
            ref={(el) => {
              if (el) sectionRefs.current.set(id, el as HTMLDivElement)
            }}
            className={cn(
              'relative flex min-h-screen snap-start flex-col items-center justify-center',
              id === 'hero' ? 'w-full px-0 pt-0' : 'px-4 pt-16 sm:px-6',
            )}
          >
            <div
              className={cn(
                'w-full',
                id !== 'hero' && 'mx-auto max-w-[1440px]',
              )}
            >
              <Section />
            </div>
          </section>
        ))}
        <div id="footer" className="relative z-10 snap-start"></div>
      </div>

      {/* ─── Section navigator (desktop) ─── */}
      <nav
        aria-label="Page sections"
        className="fixed top-1/2 right-4 z-50 hidden -translate-y-1/2 md:block lg:right-6"
      >
        <div className="flex flex-col items-end gap-1 rounded-full border border-white/10 bg-background/60 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md">
          {slides.map((s) => {
            const isActive = activeSection === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                aria-label={`Go to ${s.label}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'group relative flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60',
                  isActive ? 'bg-emerald-500/15' : 'hover:bg-white/5',
                )}
              >
                <span
                  className={cn(
                    'rounded-full transition-all duration-300',
                    isActive
                      ? 'h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]'
                      : 'h-1.5 w-1.5 bg-white/35 group-hover:bg-white/70',
                  )}
                />
                <span
                  className={cn(
                    'pointer-events-none absolute right-full mr-3 rounded-md border border-white/10 bg-background/95 px-2.5 py-1',
                    'text-xs font-medium whitespace-nowrap text-foreground/90 opacity-0 shadow-lg backdrop-blur-sm transition-all',
                    'translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100',
                  )}
                >
                  {s.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
