import { prisma } from '@/lib/db/client'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Logo from '@/components/Logo'

export default async function HomePage() {
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
  ].sort((a, b) => {
    const dateA = new Date((a as any).updated_at).getTime()
    const dateB = new Date((b as any).updated_at).getTime()
    return dateB - dateA
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-10 pb-4 sm:pt-16 sm:pb-6 transition-colors duration-300 border-b border-slate-100">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <Logo showTagline={true} className="scale-125" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
            Precision. Scale. <br />
            <span className="text-primary">Intelligence.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed mb-10 font-light">
            A curated compendium of system design patterns, architectural blueprints, and
            deep-dives into the engineering that powers the intelligence era.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/projects"
              className="px-8 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              Explore Projects
            </Link>
            <Link
              href="/tutorials"
              className="px-8 py-4 bg-transparent text-foreground font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
            >
              Browse Tutorials
            </Link>
          </div>
        </div>
      </section>

      {/* Content Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50/50 rounded-3xl mt-8 mb-12 border border-slate-100/50">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Latest Insights</h2>
            <p className="text-muted-foreground mt-2">The most recent additions to the notebook.</p>
          </div>
          <div className="hidden sm:block">
            <Link href="/projects" className="text-sm font-medium text-primary hover:underline">
              View all projects →
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {combinedContent.length > 0 && (
            <>
              {/* Featured Item */}
              {(() => {
                const item = combinedContent[0];
                const isProject = item.type === 'project';
                const slug = (item as any).slug;
                const title = (item as any).title;
                const summary = (item as any).summary;
                const href = isProject ? `/projects/${slug}` : `/tutorials/${slug}`;
                const techStack = (item as any).tech_stack || [];
                const readTime = (item as any).estimated_read_time;

                return (
                  <Card key="featured" className="bg-white border-slate-200 transition-all hover:shadow-2xl hover:-translate-y-2 duration-500 sm:col-span-2 lg:col-span-2 group overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <Link href={href} className="block p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                          isProject ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isProject ? 'Featured Project' : 'Featured Tutorial'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date((item as any).updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors leading-tight">
                        {title}
                      </h3>
                      <p className="text-muted-foreground text-lg line-clamp-2 leading-relaxed mb-8 font-light">
                        {summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {isProject ? (
                            techStack.map((tech: string) => (
                              <span key={tech} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500">
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              {readTime} min read
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                          Read Full Insight <span className="ml-1">→</span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                )
              })()}

              {/* Remaining Items */}
              {combinedContent.slice(1).map((item, idx) => {
                const isProject = item.type === 'project'
                const slug = (item as any).slug
                const title = (item as any).title
                const summary = (item as any).summary
                const typeLabel = isProject ? 'Project' : 'Tutorial'
                const href = isProject ? `/projects/${slug}` : `/tutorials/${slug}`
                const techStack = (item as any).tech_stack || []
                const readTime = (item as any).estimated_read_time

                return (
                  <Card key={idx} className="bg-white border-slate-100 transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                    <Link href={href} className="block p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                          isProject ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {typeLabel}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date((item as any).updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-8">
                        {summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {isProject ? (
                            techStack.slice(0, 2).map((tech: string) => (
                              <span key={tech} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500">
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400">
                              {readTime} min read
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs font-semibold text-primary group-hover:translate-x-1 transition-transform">
                          Read more <span className="ml-1">→</span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                )
              })}
            </>
          )}
        </div>
      </section>

      {/* Footer Teaser */}
      <footer className="border-t border-slate-100 bg-indigo-50/30 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Hungry for more?</h3>
          <p className="text-muted-foreground mb-8">Explore deep-dives into cloud native architecture, DevOps, and more.</p>
          <Link
            href="/tutorials"
            className="inline-flex items-center px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-colors"
          >
            Visit the Tutorial Hub
          </Link>
        </div>
      </footer>
    </div>
  )
}
