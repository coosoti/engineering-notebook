'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export default function CodeBlockEnhancer() {
  useEffect(() => {
    const enhanceCodeBlocks = () => {
      const preBlocks = document.querySelectorAll('pre')

      preBlocks.forEach((pre) => {
        // Avoid duplicate enhancement
        if (pre.getAttribute('data-enhanced')) return
        pre.setAttribute('data-enhanced', 'true')

        // Ensure pre has relative positioning for the button
        pre.classList.add('relative', 'group')

        // 1. Find the language
        const codeElement = pre.querySelector('code')
        const langClass = codeElement?.className || ''
        const langMatch = langClass.match(/language-(\w+)/)
        const language = langMatch ? langMatch[1] : 'code'

        // 2. Create the container for the badge and button
        const controls = document.createElement('div')
        controls.className = 'absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'

        // 3. Create the language badge
        const badge = document.createElement('span')
        badge.className = 'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 rounded border border-slate-700'
        badge.textContent = language
        controls.appendChild(badge)

        // 4. Create the copy button
        const copyBtn = document.createElement('button')
        copyBtn.className = 'px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-white rounded hover:bg-primary/90 transition-colors shadow-sm'
        copyBtn.textContent = 'Copy'

        copyBtn.onclick = async () => {
          const text = codeElement?.textContent || ''
          try {
            await navigator.clipboard.writeText(text)
            copyBtn.textContent = 'Copied!'
            toast.success('Code copied to clipboard')
            setTimeout(() => {
              copyBtn.textContent = 'Copy'
            }, 2000)
          } catch (err) {
            toast.error('Failed to copy code')
          }
        }
        controls.appendChild(copyBtn)

        // Append controls to the pre block
        pre.appendChild(controls)
      })
    }

    // Initial enhancement
    enhanceCodeBlocks()

    // Use MutationObserver to enhance blocks that might be loaded dynamically (e.g. via client-side navigation)
    const observer = new MutationObserver(enhanceCodeBlocks)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return null // This component doesn't render anything itself, it just runs the logic
}
