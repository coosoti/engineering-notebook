'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, X, FileText, BookOpen, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearch } from "@/context/SearchContext"

interface SearchResult {
  id: string
  title: string
  type: 'project' | 'tutorial' | 'series'
  path: string
}

export default function CommandPalette() {
  const { isOpen, closePalette } = useSearch()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-slate-900/40 backdrop-blur-sm"
      onClick={() => closePalette()}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-zinc-800 gap-3">
          <Search size={20} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closePalette()
            }}
            placeholder="Search projects, tutorials, or series..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 dark:text-zinc-100 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
              ESC
            </span>
            <button
              onClick={() => closePalette()}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-primary" />
              <p className="text-sm text-slate-400 mt-2">Searching notebook...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.path}
                  onClick={() => closePalette()}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={cn(
                      "p-1.5 rounded-md transition-colors",
                      result.type === 'project' ? "bg-indigo-50 text-indigo-600" :
                      result.type === 'tutorial' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {result.type === 'project' ? <Layers size={14} /> :
                       result.type === 'tutorial' ? <BookOpen size={14} /> : <FileText size={14} />}
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-zinc-100 truncate">
                      {result.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-primary transition-colors">
                    {result.type}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-400">
                {query.length < 2
                  ? "Type Cmd+K to search your notebook"
                  : `No results found for "${query}"`}
              </p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
          <span className="text-[10px] text-slate-400">Press <kbd className="font-sans px-1 py-0.5 bg-white border border-slate-200 rounded shadow-sm">Enter</kbd> to select</span>
          <span className="text-[10px] text-slate-400">Powered by Postgres</span>
        </div>
      </div>
    </div>
  )
}
