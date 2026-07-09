import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Engineering Notebook
              </Link>
            </div>
            <nav className="ml-10 flex space-x-8">
              <Link href="/" className="text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/projects" className="text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                Projects
              </Link>
              <Link href="/tutorials" className="text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                Tutorials
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Link
              href="/admin"
              className="ml-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all shadow-sm hover:shadow-indigo-500/20"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}