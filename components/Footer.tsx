'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa6"

export default function Footer() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <footer className="border-t border-border bg-muted/30 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
              Engineering Notebook
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A curated digital garden of AI engineering, system design, and DevOps explorations.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaGithub size={20} />
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaTwitter size={20} />
              </Link>
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <FaLinkedin size={20} />
              </Link>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/tutorials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/series" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Series
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Meta</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/rss.xml" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    RSS Feed
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">System Status</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {mounted ? new Date().toLocaleDateString() : ""}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {mounted ? new Date().getFullYear() : "2026"} Engineering Notebook. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
