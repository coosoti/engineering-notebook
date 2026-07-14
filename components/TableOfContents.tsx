'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: TOCItem[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 h-fit w-64 hidden xl:block">
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          On this page
        </h4>
        <ul className="space-y-2 border-l border-slate-200 ml-1">
          {headings.map((heading) => (
            <li key={heading.id} className="pl-4">
              <Link
                href={`#${heading.id}`}
                className={cn(
                  "block text-sm transition-all duration-200 py-1",
                  heading.level === 3 ? "ml-3" : "",
                  activeId === heading.id
                    ? "text-primary font-semibold border-l-2 border-primary -ml-[1px]"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
