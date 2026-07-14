import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAuditLogs } from "@/lib/db/audit-log"
import Card from "@/components/ui/Card"
import { ShieldAlert, Clock, User, Hash } from "lucide-react"

export default async function AuditLogPage() {
  const session = await auth()
  const user = session?.user as any

  if (!session || user?.role?.toUpperCase() !== 'ADMIN') {
    redirect("/")
  }

  const logs = await getAuditLogs()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">System Audit Log</h2>
        <p className="text-slate-500 mt-1">
          A detailed record of all administrative actions performed within the system.
        </p>
      </div>

      <Card className="overflow-hidden p-0 border-slate-200 bg-white dark:bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Action</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Entity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">IP Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={12} />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <User size={14} className="text-slate-400" />
                        {log.user?.name || log.user?.email || 'Unknown User'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Hash size={14} className="text-slate-400" />
                        <span className="font-mono">{log.entity_type}: {log.entity_id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono text-slate-400 truncate block max-w-[100px]">
                        {log.ip_address}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
