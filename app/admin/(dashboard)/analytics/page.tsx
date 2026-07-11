import { getAnalyticsOverview, AnalyticsOverview } from "@/lib/db/analytics"

export default async function AnalyticsPage() {
  const stats: AnalyticsOverview = await getAnalyticsOverview()

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Site Analytics
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Anonymous tracking of reader engagement.
          </p>
        </div>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Page Views</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalViews.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Unique Sessions</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.uniqueSessions.toLocaleString()}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Avg. Sessions per Visitor</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {stats.totalViews > 0 ? (stats.totalViews / stats.uniqueSessions).toFixed(2) : '0'}
            </dd>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Pages Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Top Pages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time (s)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topPages.map((page) => (
                  <tr key={page.path}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">
                      {page.path}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {page.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {Math.round(page.avgDuration)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Device Distribution</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {stats.deviceDistribution.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{device.device}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(device.count / stats.totalViews) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{device.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
