import { AboutSection } from '#/components/landing/about'
import { BlogsSection } from '#/components/landing/blogs'
import { ContactsSection } from '#/components/landing/contacts'
import { HeroSection } from '#/components/landing/hero'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <BlogsSection />
      <ContactsSection />
    </main>
  )
}
