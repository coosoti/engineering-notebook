import { getProjects } from "@/lib/db/projects"
import { getTutorials } from "@/lib/db/tutorials"
import { getSeries } from "@/lib/db/series"
import Link from "next/link"

export default async function AdminDashboard() {
  const projects = await getProjects()
  const tutorials = await getTutorials()
  const series = await getSeries()

  const draftCount = 
    projects.filter(p => p.status === "draft").length + 
    tutorials.filter(t => t.status === "draft").length

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Command Center
          </h2>
          <p className="text-gray-500 mt-1">Welcome back. Here is the current state of your engineering notebook.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[ 
          { label: 'Total Projects', value: projects.length, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', href: '/admin/projects', color: 'bg-indigo-600' },
          { label: 'Total Tutorials', value: tutorials.length, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', href: '/admin/tutorials', color: 'bg-blue-600' },
          { label: 'Learning Paths', value: series.length, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', href: '/admin/series', color: 'bg-purple-600' },
          { label: 'Draft Content', value: draftCount, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', href: '/admin/projects', color: 'bg-slate-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 transition-all shadow-sm group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <Link href={stat.href} className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Manage →
              </Link>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <span className="text-xs text-gray-400">Last 6 updates</span>
        </div>
        <div className="divide-y divide-gray-100">
          {[...projects.slice(0, 3), ...tutorials.slice(0, 3)].sort((a, b) => 
            new Date((b as any).created_at).getTime() - new Date((a as any).created_at).getTime()
          ).map((item, idx) => {
            const isProject = (item as any).type === 'project' || !('series_id' in item);
            const title = (item as any).title;
            const summary = (item as any).summary;
            const createdAt = new Date((item as any).created_at).toLocaleDateString();
            const href = isProject ? `/admin/projects/${(item as any).id}/edit` : `/admin/tutorials/${(item as any).id}/edit`;

            return (
              <Link 
                key={idx} 
                href={href}
                className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full ${isProject ? 'bg-indigo-500' : 'bg-blue-500'}`} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {title}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                      {summary}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isProject ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                    {isProject ? 'Project' : 'Tutorial'}
                  </span>
                  <span className="text-xs text-gray-400">{createdAt}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}