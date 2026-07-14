import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminHeader from "@/components/AdminHeader"
import AdminFooter from "@/components/AdminFooter"
import { Permissions } from "@/lib/permissions"
import PageTransition from "@/components/PageTransition"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  const user = session.user as any
  const userRole = user?.role?.toUpperCase()

  if (!['ADMIN', 'EDITOR', 'AUTHOR'].includes(userRole)) {
    redirect("/")
  }

  if (user?.mustChangePassword) {
    redirect("/admin/settings/password")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f0] text-slate-900 antialiased">
      <AdminHeader session={session} />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
      <AdminFooter />
    </div>
  )
}
