'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemeToggle from "@/components/ThemeToggle"
import { Menu, X, Search } from "lucide-react"
import { useSearch } from "@/context/SearchContext"
import Logo from "@/components/Logo"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { openPalette } = useSearch()
  const pathname = usePathname()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Tutorials', href: '/tutorials' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="shrink-0 flex items-center">
              <Logo />
            </div>
            <nav className="hidden md:flex ml-10 items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openPalette}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-xs font-medium hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all border border-slate-200 dark:border-zinc-700"
            >
              <Search size={14} />
              <span>Search...</span>
              <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-[10px]">⌘K</kbd>
            </button>
            <ThemeToggle />
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center px-4 py-1.5 text-xs font-bold rounded-full text-white bg-foreground hover:opacity-90 transition-all shadow-sm"
            >
              Admin
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  pathname === link.href ? 'bg-primary text-white' : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <Link
                href="/admin"
                className="block px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
