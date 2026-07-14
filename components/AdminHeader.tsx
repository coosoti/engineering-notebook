'use client'

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import ThemeToggle from "@/components/ThemeToggle"
import { useSearch } from "@/context/SearchContext"
import { Menu, X, LayoutDashboard, BookOpen, Layers, ExternalLink, LogOut, Users } from "lucide-react"
import Logo from "@/components/Logo"
import { Permissions } from "@/lib/permissions"

export default function AdminHeader({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const { openPalette } = useSearch()

  const user = session?.user
  const userWithRole = user ? { id: user.id, role: user.role } : null

  return (
    <header className="sticky top-0 z-50 w-full glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <Logo href="/admin" />
            </div>
            <nav className="hidden lg:flex ml-10 gap-x-6">
              <Link href="/admin" className="text-muted-foreground hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors whitespace-nowrap">
                Dashboard
              </Link>
              {userWithRole && Permissions.canCreateContent(userWithRole) && (
                <>
                  <Link href="/admin/projects" className="text-muted-foreground hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors whitespace-nowrap">
                    Projects
                  </Link>
                  <Link href="/admin/tutorials" className="text-muted-foreground hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors whitespace-nowrap">
                    Tutorials
                  </Link>
                  <Link href="/admin/series" className="text-muted-foreground hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors whitespace-nowrap">
                    Series
                  </Link>
                </>
              )}
              {userWithRole && Permissions.canManageUsers(userWithRole) && (
                <Link href="/admin/users" className="text-muted-foreground hover:text-primary inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors whitespace-nowrap">
                  Users
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openPalette}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95"
            >
              <span className="opacity-70">Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-sans">⌘K</kbd>
            </button>
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
            >
              <LogOut size={14} />
              Logout
            </button>
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow-sm
                         bg-foreground text-background hover:opacity-90 active:scale-95"
            >
              <ExternalLink size={14} />
              View Site
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-4 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            {userWithRole && Permissions.canCreateContent(userWithRole) && (
              <>
                <Link
                  href="/admin/projects"
                  className="flex items-center gap-3 px-3 py-4 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Layers size={18} /> Projects
                </Link>
                <Link
                  href="/admin/tutorials"
                  className="flex items-center gap-3 px-3 py-4 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <BookOpen size={18} /> Tutorials
                </Link>
                <Link
                  href="/admin/series"
                  className="flex items-center gap-3 px-3 py-4 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Layers size={18} /> Series
                </Link>
              </>
            )}
            {userWithRole && Permissions.canManageUsers(userWithRole) && (
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-3 py-4 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Users size={18} /> Users
              </Link>
            )}
            <div className="pt-4 border-t border-border mt-4">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-3 py-4 text-base font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <ExternalLink size={18} /> View Public Site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-4 text-base font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
