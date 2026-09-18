import * as React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

import { articlesOverviewQueryOptions } from '#/data/articles'
import SocialsWidget from '#/components/articles/social-category'
import CategoryColumn from '#/components/articles/category-column'
import FeaturedSection from '#/components/articles/featured-section'

export const Route = createFileRoute('/articles/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(articlesOverviewQueryOptions())
  },
  component: ArticlesOverviewPage,
  head: () => ({
    meta: [
      { title: 'Articles | Tisini' },
      {
        name: 'description',
        content:
          'African sports news, match recaps, features and analysis from Tisini — Football, Rugby, and more.',
      },
    ],
  }),
})

function ArticlesOverviewPage() {
  return (
    <React.Suspense
      fallback={
        <div className="text-sm text-muted-foreground">Loading articles…</div>
      }
    >
      <ArticlesOverview />
    </React.Suspense>
  )
}

function ArticlesOverview() {
  const { data } = useSuspenseQuery(articlesOverviewQueryOptions())

  const featuredArticle = data.featured
  const sidebarArticles = data.latest ?? []
  const categories = data.categories ?? {}

  const footballCategory = categories['Football'] ?? []
  const rugbyCategory = categories['Rugby'] ?? []
  const matchRecaps = categories['Match-Recap'] ?? []
  const features = categories['Features'] ?? []
  const statsRecap = categories['Stats-Recap'] ?? []

  return (
    <div>
      {featuredArticle && (
        <FeaturedSection
          article={featuredArticle}
          recentPosts={sidebarArticles}
        />
      )}

      <div className="mt-2 hidden md:block">
        <Link
          className="block overflow-hidden rounded-xl border border-border"
          to={'/quiz/GN88FDHhWw7n' as any}
        >
          <img
            src="/quiz.jpeg"
            alt="Play Tisini Quiz"
            className="h-auto w-full opacity-80"
          />
        </Link>
      </div>

      {/* Sports desk — two equal columns */}
      <section className="mt-10">
        <div className="grid gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
          <CategoryColumn
            category="Football"
            categorySlug="Football"
            articles={footballCategory}
          />
          <CategoryColumn
            category="Rugby"
            categorySlug="Rugby"
            articles={rugbyCategory}
          />
        </div>
      </section>

      <div className="mt-10 hidden md:block">
        <Link
          className="block overflow-hidden rounded-xl border border-border"
          to={'/tanobora' as any}
        >
          <img
            src="https://i.postimg.cc/GhzxYdYq/tanobora.jpg"
            alt="Tano Bora"
            className="h-auto w-full"
          />
        </Link>
      </div>

      {/* Editorial — Match Recaps | Features, then Stats | Socials */}
      <section className="mt-10">
        <div className="grid gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
          <CategoryColumn
            category="Match Recaps"
            categorySlug="Match-Recap"
            articles={matchRecaps}
          />
          <CategoryColumn
            category="Features"
            categorySlug="Features"
            articles={features}
          />
        </div>

        <div className="mt-10 grid gap-10 border-t border-border pt-8 md:grid-cols-2 md:gap-8 lg:gap-12">
          <CategoryColumn
            category="Stats Recap"
            categorySlug="Stats-Recap"
            articles={statsRecap}
          />
          <SocialsWidget />
        </div>
      </section>
    </div>
  )
}
