'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    // 1. Handle Session ID
    let sessionId = localStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('analytics_session_id', sessionId)
    }

    // 2. Record Page View
    const recordPageView = async () => {
      try {
        await fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            session_id: sessionId,
            content_type: determineContentType(pathname),
            content_id: extractContentId(pathname),
          }),
        })
      } catch (e) {
        console.error('Failed to record page view', e)
      }
    }

    // 3. Record Duration on Exit
    const recordDuration = async () => {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      try {
        await fetch('/api/analytics/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            session_id: sessionId,
            duration: duration,
          }),
        })
      } catch (e) {
        console.error('Failed to record duration', e)
      }
    }

    // Initial hit
    recordPageView()
    startTimeRef.current = Date.now()

    // Track visibility changes (standard way to detect page exit/tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        recordDuration()
      } else {
        startTimeRef.current = Date.now()
      }
    }

    window.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      // Final attempt to record duration on unmount
      recordDuration()
    }
  }, [pathname])

  function determineContentType(path: string) {
    if (path.startsWith('/projects/')) return 'project'
    if (path.startsWith('/tutorials/')) return 'tutorial'
    if (path.startsWith('/series/')) return 'series'
    return 'other'
  }

  function extractContentId(path: string) {
    const parts = path.split('/')
    return parts[parts.length - 1] || null
  }

  return null // This component doesn't render anything
}
