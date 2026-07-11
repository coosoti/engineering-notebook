import { prisma } from '@/lib/db/client'
import Link from 'next/link'

export default async function HomePage() {
  // Fetch latest projects and tutorials
  const projects = await prisma.project.findMany({
    where: { status: 'published' },
    orderBy: { updated_at: 'desc' },
    take: 6,
  })

  const tutorials = await prisma.tutorial.findMany({
    where: { status: 'published' },
    orderBy: { updated_at: 'desc' },
    take: 6,
  })

  const combinedContent = [
    ...projects.map(p => ({ ...p, type: 'project' as const })),
    ...tutorials.map(t => ({ ...t, type: 'tutorial' as const })),
  ].sort((a, b) => (
    (b as any).updated_at > (a as any).updated_at ? 1 : -1
  ))

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 py-24 sm:py-32">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-200 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Engineering <span className="text-indigo-600">Notebook</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed mb-10">
            A curated collection of technical deep-dives, architecture patterns, and 
            hands-on guides for the modern software engineer.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/projects" 
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Explore Projects
            </Link>
            <Link 
              href="/tutorials" 
              className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
            >
              Browse Tutorials
            </Link>
          </div>
        </div>
      </section>

      {/* Content Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Latest Insights</h2>
            <p className="text-gray-600 mt-2">The most recent additions to the notebook.</p>
          </div>
          <div className="hidden sm:block">
            <Link href="/projects" className="text-sm font-medium text-indigo-600 hover:underline">View all projects →</Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {combinedContent.map((item, idx) => {
            const isProject = item.type === 'project'
            const slug = (item as any).slug
            const title = (item as any).title
            const summary = (item as any).summary
            const typeLabel = isProject ? 'Project' : 'Tutorial'
            const typeColor = isProject ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
            const href = isProject ? `/projects/${slug}` : `/tutorials/${slug}`

            return (
              <Link 
                key={idx} 
                href={href}
                className="group relative p-6 bg-white border border-gray-100 rounded-2xl hover:border-indigo-500 transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${typeColor}`}>
                    {typeLabel}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date((item as any).updated_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
                  {summary}
                </p>
                <div className="flex items-center text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Footer Teaser */}
      <footer className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Hungry for more?</h3>
          <p className="text-gray-600 mb-8">Explore deep-dives into cloud native architecture, DevOps, and more.</p>
          <Link 
            href="/tutorials"
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Visit the Tutorial Hub
          </Link>
        </div>
      </footer>
    </div>
  )
}
