import { prisma } from '@/lib/db/client'
import Link from 'next/link'
import Card from '@/components/ui/Card'

export default async function SeriesPage() {
  const series = await prisma.series.findMany({
    include: {
      _count: { select: { tutorials: true } }
    },
    orderBy: { created_at: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Learning Paths
          </h2>
          <p className="text-muted-foreground mt-1">
            Architect your knowledge. Manage your grouped tutorials and structured courses.
          </p>
        </div>
        <Link
          href="/admin/series/new"
          className="inline-flex items-center px-4 py-2 rounded-lg shadow-sm text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-all active:scale-95"
        >
          + New Series
        </Link>
      </div>

      {series.length === 0 ? (
        <Card className="text-center py-20 border-dashed border-2">
          <p className="text-muted-foreground">No series created yet. Start by building your first learning path!</p>
          <Link href="/admin/series/new" className="mt-4 inline-block text-primary font-medium hover:underline">Create your first series →</Link>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((s) => (
            <Card key={s.id} className="overflow-hidden flex flex-col h-full">
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    s.status === 'published' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 truncate">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                  {s.description || 'No description provided for this learning path.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{s._count.tutorials}</span>
                    <span className="ml-1">Tutorials</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 px-6 py-3 flex gap-3 border-t border-border">
                <Link
                  href={`/admin/series/${s.id}/edit`}
                  className="flex-1 text-center px-3 py-2 text-xs font-semibold text-foreground bg-background border border-border rounded-md hover:bg-background/80 transition-colors"
                >
                  Edit Path
                </Link>
                <Link
                  href={`/admin/tutorials/new?seriesId=${s.id}`}
                  className="flex-1 text-center px-3 py-2 text-xs font-semibold text-primary-foreground bg-primary rounded-md hover:opacity-90 transition-colors"
                >
                  + Add Lesson
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
