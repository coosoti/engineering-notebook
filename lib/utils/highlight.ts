import { createHighlighter } from 'shiki'

let highlighterPromise: Promise<any> | null = null

async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark'],
      langs: ['javascript', 'typescript', 'python', 'bash', 'rust', 'go', 'html', 'css', 'json', 'yaml']
    })
  }
  return highlighterPromise
}

export async function highlightHtml(html: string) {
  const highlighter = await getHighlighter()

  // Simple regex to find <pre><code class="language-xxx">...</code></pre>
  // This is a basic implementation. For a production app, a proper HTML parser is better.
  const codeBlockRegex = /<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g

  let match
  let highlightedHtml = html

  // We need to use a temporary marker to avoid replacing already highlighted content
  const replacements: { marker: string, content: string }[] = []
  let markerCount = 0

  while ((match = codeBlockRegex.exec(html)) !== null) {
    const [fullMatch, lang, code] = match
    const highlighted = highlighter.codeToHtml(code, {
      lang: lang,
      theme: 'github-dark'
    })

    const marker = `___SHIKI_MARKER_${markerCount++}___`
    replacements.push({ marker, content: highlighted })
    highlightedHtml = highlightedHtml.replace(fullMatch, marker)
  }

  for (const { marker, content } of replacements) {
    highlightedHtml = highlightedHtml.replace(marker, content)
  }

  return highlightedHtml
}
