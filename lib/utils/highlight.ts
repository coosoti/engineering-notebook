// lib/utils/highlight.ts
import { createLowlight } from 'lowlight'
import { toHtml } from 'hast-util-to-html'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'

const lowlight = createLowlight()

// Register languages
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('python', python)
lowlight.register('bash', bash)
lowlight.register('rust', rust)
lowlight.register('go', go)
lowlight.register('html', xml)
lowlight.register('css', css)
lowlight.register('json', json)
lowlight.register('yaml', yaml)

export async function highlightHtml(html: string) {
  const codeBlockRegex = /<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g

  let match
  let highlightedHtml = html
  const replacements: { marker: string; content: string }[] = []
  let markerCount = 0

  while ((match = codeBlockRegex.exec(html)) !== null) {
    const [fullMatch, lang, code] = match
    
    const decodedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

    try {
      // lowlight.highlight returns a Root object (hast tree)
      const highlighted = lowlight.highlight(decodedCode, lang)
      
      // Convert the hast tree to HTML string
      const highlightedCode = toHtml(highlighted)
      
      const marker = `___HIGHLIGHT_MARKER_${markerCount++}___`
      
      replacements.push({ 
        marker, 
        content: `<pre><code class="language-${lang}">${highlightedCode}</code></pre>` 
      })
      highlightedHtml = highlightedHtml.replace(fullMatch, marker)
    } catch (e) {
      // If language is not supported, keep original
      console.warn(`Language "${lang}" not supported for highlighting`)
    }
  }

  // Replace markers with highlighted content
  for (const { marker, content } of replacements) {
    highlightedHtml = highlightedHtml.replace(marker, content)
  }

  return highlightedHtml
}