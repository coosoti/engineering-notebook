export interface TOCItem {
  id: string
  text: string
  level: number
}

export function extractHeadings(html: string): TOCItem[] {
  const headings: TOCItem[] = []
  const regex = /<(h[23])([^>]*)>(.*?)<\/h[23]>/gi
  let match
  let count = 0

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1].charAt(1))
    const text = match[3].replace(/<[^>]*>/g, '')

    // Create a slug for the ID
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/, '') || `heading-${count}`

    headings.push({ id, text, level })
    count++
  }

  return headings
}

export function injectHeadingIds(html: string): string {
  const headings = extractHeadings(html)
  let injectedHtml = html

  headings.forEach((heading) => {
    // This is a simple replacement. In a production app, a proper HTML parser like JSDOM would be better.
    // We look for the heading text and inject the id into the opening tag.
    const escapedText = heading.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`<(h[23])([^>]*)>${escapedText}<\/h[23]>`, 'gi')
    injectedHtml = injectedHtml.replace(regex, `<h$${heading.level} id="${heading.id}"$2>${heading.text}</h$${heading.level}>`)
  })

  // If the regex above is too restrictive, a more robust way is to use a simple counter
  // and replace every h2/h3 with one containing an ID.
  if (injectedHtml === html) {
     let hCount = 0;
     return html.replace(/<(h[23])([^>]*)>/gi, (match, tag, attrs) => {
       return `<${tag} id="heading-${hCount++}"${attrs}>`;
     });
  }

  return injectedHtml
}
