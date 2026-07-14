import { getProjects } from "@/lib/db/projects"
import { getTutorials } from "@/lib/db/tutorials"
import { prisma } from "@/lib/db/client"
import { auth } from "@/lib/auth"
import { Permissions } from "@/lib/permissions"
import Link from "next/link"
import Card from "@/components/ui/Card"
import { LayoutDashboard, BookOpen, FileText, ClipboardList, BarChart3, ArrowRight, Users } from "lucide-react"

export default async function AdminDashboard() {
  const session = await auth()
  const user = session?.user as any
  const userWithRole = user ? { id: user.id, role: user.role } : null

  const projects = await getProjects()
  const tutorials = await getTutorials()
  const userCount = await prisma.user.count()

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      link: "/admin/projects",
      icon: LayoutDashboard,
      accent: "text-primary bg-primary/10",
    },
    {
      label: "Total Tutorials",
      value: tutorials.length,
      link: "/admin/tutorials",
      icon: BookOpen,
      accent: "text-[#ea580c] bg-[#ea580c]/10",
    },
    ...(userWithRole && Permissions.canManageUsers(userWithRole) ? [{
      label: "Total Users",
      value: userCount,
      link: "/admin/users",
      icon: Users,
      accent: "text-indigo-600 bg-indigo-50",
    }] : []),
    {
      label: "Draft Content",
      value: projects.filter(p => p.status === "draft").length + tutorials.filter(t => t.status === "draft").length,
      link: "/admin/projects",
      icon: FileText,
      accent: "text-slate-600 bg-slate-100",
    },
    {
      label: "Site Analytics",
      value: "Active",
      link: "/admin/analytics",
      icon: BarChart3,
      accent: "text-cyan-600 bg-cyan-50",
    },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h2>
        <p className="text-slate-500 mt-1">
          Welcome back. Here is an overview of your notebook's current state.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group bg-white dark:bg-white border-slate-200 hover:border-primary/30">
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${stat.accent} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-medium text-slate-400">Live</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                {stat.value}
              </p>
            </div>
            <div className="mt-6">
              <Link
                href={stat.link}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 transition-colors"
              >
                Manage {stat.label.toLowerCase()} <ArrowRight size={12} />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            <Link href="/admin/audit-log" className="text-xs font-medium text-primary hover:underline">
              View Audit Log →
            </Link>
          </div>

          <Card className="overflow-hidden p-0 border-slate-200 bg-white dark:bg-white">
            <div className="divide-y divide-slate-200">
              {[...projects, ...tutorials]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 6)
                .map((item, idx) => {
                  const isProject = "Project" in item || (item as any).github_url !== undefined;
                  return (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-all duration-200 group flex items-center gap-4">
                      <div className={`w-1 h-10 rounded-full ${isProject ? "bg-primary" : "bg-[#ea580c]"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <Link
                            href={`/admin/${isProject ? "projects" : "tutorials"}/${item.id}/edit`}
                            className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors truncate block"
                          >
                            {item.title}
                          </Link>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {isProject ? "Project" : "Tutorial"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {item.summary}
                        </p>
                      </div>
                      <Link
                        href={`/admin/${isProject ? "projects" : "tutorials"}/${item.id}/edit`}
                        className="p-2 text-slate-400 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
          <div className="grid gap-4">
            {[
              { label: "New Project", href: "/admin/projects/new", icon: FileText, color: "text-primary" },
              { label: "New Tutorial", href: "/admin/tutorials/new", icon: BookOpen, color: "text-[#ea580c]" },
              { label: "New Series", href: "/admin/series/new", icon: ClipboardList, color: "text-slate-600" },
              ...(userWithRole && Permissions.canManageUsers(userWithRole)
                ? [{ label: "Manage Users", href: "/admin/users", icon: Users, color: "text-indigo-600" }]
                : []),
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-primary/50 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-100 ${action.color} transition-colors group-hover:bg-white`}>
                    <action.icon size={18} />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{action.label}</span>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
