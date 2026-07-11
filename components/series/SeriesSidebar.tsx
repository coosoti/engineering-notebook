import Link from 'next/link'
import { Tutorial } from '@prisma/client'
import { cn } from '@/lib/utils'

interface SeriesSidebarProps {
  currentTutorialSlug: string
  tutorials: Tutorial[]
  seriesTitle: string
}

export default function SeriesSidebar({ 
  currentTutorialSlug, 
  tutorials, 
  seriesTitle 
}: SeriesSidebarProps) {
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            {seriesTitle}
          </h3>
          <nav className="space-y-1">
            {tutorials.map((tutorial, index) => {
              const isActive = tutorial.slug === currentTutorialSlug
              return (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${tutorial.slug}`}
                  className={cn(
                    "group flex items-start gap-3 px-3 py-2 rounded-md text-sm transition-all",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 font-medium" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span className={cn(
                    "flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold",
                    isActive ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
                  )}>
                    {index + 1}
                  </span>
                  <span className="line-clamp-2">
                    {tutorial.title}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}