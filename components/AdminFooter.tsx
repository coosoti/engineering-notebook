import Link from 'next/link'

export default function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full py-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900">
              Engineering <span className="text-primary">Notebook</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500 font-medium">
              v1.0.0
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs font-medium text-slate-500 hover:text-primary transition-colors"
            >
              Public Site
            </Link>
            <span className="text-xs text-slate-400">
              &copy; {currentYear} Architect Framework. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
