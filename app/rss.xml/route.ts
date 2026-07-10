import { getProjects } from "@/lib/db/projects"
import { getTutorials } from "@/lib/db/tutorials"
import { NextResponse } from "next/server"

export async function GET() {
  const projects = await getProjects()
  const tutorials = await getTutorials()

  const items = [
    ...projects.map(p => ({
      title: p.title,
      link: `https://yourdomain.com/projects/${p.slug}`,
      description: p.summary,
      pubDate: p.created_at.toUTCString()
    })),
    ...tutorials.map(t => ({
      title: t.title,
      link: `https://yourdomain.com/tutorials/${t.slug}`,
      description: t.summary,
      pubDate: t.created_at.toUTCString()
    }))
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Engineering Notebook</title>
    <link>https://yourdomain.com</link>
    <description>Technical notes on AI Engineering, System Design, DevOps, and MLOps</description>
    <language>en-us</language>
    <atom:link href="https://yourdomain.com/rss.xml" rel="self" type="application/rss+xml" />
    ${items.map(item => `
      <item>
        <title>${item.title}</title>
        <link>${item.link}</link>
        <description>${item.description}</description>
        <pubDate>${item.pubDate}</pubDate>
      </item>
    `).join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
    }
  })
}
