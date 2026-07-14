import React from 'react'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

interface LogoProps {
  className?: string
  showText?: boolean
  showTagline?: boolean
  href?: string
}

export default function Logo({ className = '', showText = true, showTagline = false, href = '/' }: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 transition-opacity hover:opacity-90 ${className}`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-700 text-white shadow-lg ring-1 ring-white/20">
        <BookOpen size={18} strokeWidth={2.5} />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Engineering <span className="text-primary">Notebook</span>
          </span>
          {showTagline && (
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mt-0.5">
              Architecting the Intelligence Era
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
