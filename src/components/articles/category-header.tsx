import { Link } from '@tanstack/react-router'
import { CircleArrowRight } from 'lucide-react'

type HeaderProps = {
  category: string
  /** URL/API category key. Defaults to `category` when omitted. */
  categorySlug?: string
  /** When true (default), show the View All link. Hide on the category page itself. */
  showViewAll?: boolean
}

const CategoryHeader = ({
  category,
  categorySlug,
  showViewAll = true,
}: HeaderProps) => {
  return (
    <div className="border-t-2 border-emerald-400/80">
      <div className="flex items-center justify-between py-3">
        <span className="font-heading text-sm font-bold tracking-wide text-emerald-300 uppercase sm:text-base">
          {category}
        </span>

        {showViewAll && (
          <Link
            to="/articles/categories/$categorySlug"
            params={{ categorySlug: categorySlug ?? category }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-emerald-300 sm:text-sm"
          >
            <span>View All</span>
            <CircleArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default CategoryHeader
