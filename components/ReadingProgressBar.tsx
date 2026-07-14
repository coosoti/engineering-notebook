'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [completion, setCompletion] = useState(0)

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentScrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight

      if (scrollHeight > 0) {
        setCompletion((currentScrollY / scrollHeight) * 100)
      }
    }

    window.addEventListener('scroll', updateScrollCompletion)
    return () => window.removeEventListener('scroll', updateScrollCompletion)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100]">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${completion}%` }}
      />
    </div>
  )
}
