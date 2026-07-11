import { prisma } from '@/lib/db/client'
import Link from 'next/link'

export default async function SeriesPage() {
  const series = await prisma.series.findMany({
    include: {
      _count: { select: { tutorials: true } }
    },
    orderBy: { created_at: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-extrabold leading-7 text-gray-900 sm:truncate">
            Learning Paths
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Architect your knowledge. Manage your grouped tutorials and structured courses.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/series/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + New Series
          </Link>
        </div>
      </div>

      {series.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No series created yet. Start by building your first learning path!</p>
          <Link href="/admin/series/new" className="mt-4 inline-block text-indigo-600 font-medium hover:underline">Create your first series →</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((s) => (
            <div 
              key={s.id} 
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${ 
                    s.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                  {s.description || 'No description provided for this learning path.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center text-xs text-gray-400">
                    <span className="font-semibold text-gray-600">{s._count.tutorials}</span>
                    <span className="ml-1">Tutorials</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex gap-3 border-t border-gray-100">
                <Link
                  href={`/admin/series/${s.id}/edit`}
                  className="flex-1 text-center px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Edit Path
                </Link>
                <Link
                  href={`/admin/tutorials/new?seriesId=${s.id}`}
                  className="flex-1 text-center px-3 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  + Add Lesson
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}