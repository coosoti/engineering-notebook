'use client'

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'glass'
}

export default function Card({ children, className = "", variant = 'default' }: CardProps) {
  const baseStyles = "rounded-xl transition-all duration-300 border"
  const variants = {
    default: "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-1",
    glass: "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-white/20 dark:border-zinc-800/50 shadow-sm"
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)}>
      {children}
    </div>
  )
}
