import { getProjects } from "@/lib/db/projects"
import { getTutorials } from "@/lib/db/tutorials"
import { NextResponse } from "next/server"

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://engineering-notebook.vercel.app"

  const projects = await getProjects()
  const tutorials = await getTutorials()

  const items = [
    ...projects.map(p => ({
      title: p.title,
      link: `${baseUrl}/projects/${p.slug}`,
      description: p.summary,
      pubDate: p.created_at.toUTCString()
    })),
    ...tutorials.map(t => ({
      title: t.title,
      link: `${baseUrl}/tutorials/${t.slug}`,
      description: t.summary,
      pubDate: t.created_at.toUTCString()
    }))
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Engineering Notebook</title>
    <link>${baseUrl}</link>
    <description>Technical notes on AI Engineering, System Design, DevOps, and MLOps</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.map(item => `
      <item>
        <title>${escapeXml(item.title)}</title>
        <link>${item.link}</link>
        <description>${escapeXml(item.description)}</description>
        <pubDate>${item.pubDate}</pubDate>
      </item>
    `).join("")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59"
    }
  })
}
