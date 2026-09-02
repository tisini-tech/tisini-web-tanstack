// src/components/site/header.tsx
import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ModeToggle } from '#/components/site/mode-toggle'
import { cn } from '@/lib/utils'

const navLinks = [
  { id: 'hero', href: '/', label: 'Home', scrollOnHome: true },
  { id: 'about', href: '/about', label: 'About', scrollOnHome: true },
  { id: 'products', href: '/', label: 'Products', scrollOnHome: true },
  { id: 'articles', href: '/articles', label: 'Articles', scrollOnHome: false },
  {
    id: 'livescores',
    href: '/livescores',
    label: 'Livescores',
    scrollOnHome: false,
  },
  { id: 'contacts', href: '/contact', label: 'Contact', scrollOnHome: true },
] as const

interface SiteHeaderProps {
  activeSection?: string
  onNavigate?: (sectionId: string) => void
}

export const SiteHeader = ({ activeSection, onNavigate }: SiteHeaderProps) => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  React.useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isLinkActive = (link: (typeof navLinks)[number]) => {
    if (link.id === 'articles') return pathname.startsWith('/articles')
    if (link.id === 'livescores') return pathname.startsWith('/livescores')
    if (link.id === 'about' && pathname === '/about') return true
    if (isHome && activeSection && link.scrollOnHome) {
      return activeSection === link.id
    }
    return pathname === link.href
  }

  const linkClasses = (isActive: boolean) =>
    cn(
      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
      isActive
        ? 'bg-primary/20 text-primary'
        : 'text-foreground/70 hover:bg-muted hover:text-foreground',
    )

  const renderNavItem = (
    link: (typeof navLinks)[number],
    className: string,
  ) => {
    const isActive = isLinkActive(link)
    const classes = cn(className, linkClasses(isActive))

    if (isHome && onNavigate && link.scrollOnHome) {
      return (
        <button
          key={link.id}
          onClick={() => onNavigate(link.id)}
          aria-current={isActive ? 'page' : undefined}
          className={classes}
        >
          {link.label}
        </button>
      )
    }

    const to = link.href as any
    const hash = link.id === 'products' && !isHome ? 'products' : undefined

    return (
      <Link
        key={link.id}
        to={to}
        hash={hash}
        aria-current={isActive ? 'page' : undefined}
        className={classes}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/55 backdrop-blur-md">
      {/* Fixed escapes the parent shell — re-apply the same max-width + padding as main */}
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6">
        {isHome && onNavigate ? (
          <button
            onClick={() => onNavigate('hero')}
            className="shrink-0"
            aria-label="Go to top"
          >
            <img
              src="/tisini-logo.png"
              alt="Tisini"
              className="h-12 w-20 object-contain"
              width={80}
              height={48}
            />
          </button>
        ) : (
          <Link to="/" className="shrink-0" aria-label="Tisini home">
            <img
              src="/tisini-logo.png"
              alt="Tisini"
              className="h-12 w-20 object-contain"
              width={80}
              height={48}
            />
          </Link>
        )}

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map((link) => renderNavItem(link, ''))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          <Link
            to={'/login' as any}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-foreground"
          >
            Sign In
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <button
            className="rounded-lg p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background/95 backdrop-blur-md md:hidden"
        >
          <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
            {navLinks.map((link) =>
              renderNavItem(
                link,
                'rounded-lg px-3 py-3 text-left text-sm font-medium',
              ),
            )}
            <div className="mt-2 border-t border-border pt-3">
              <Link
                to={'/login' as any}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-600"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
