import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    // Search Projects
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
      },
      select: { id: true, title: true, slug: true },
      take: 5,
    })

    // Search Tutorials
    const tutorials = await prisma.tutorial.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { summary: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
      },
      select: { id: true, title: true, slug: true },
      take: 5,
    })

    // Search Series
    const series = await prisma.series.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, slug: true },
      take: 5,
    })

    const results = [
      ...projects.map(p => ({ ...p, type: 'project', path: `/projects/${p.slug}` })),
      ...tutorials.map(t => ({ ...t, type: 'tutorial', path: `/tutorials/${t.slug}` })),
      ...series.map(s => ({ ...s, type: 'series', path: `/series/${s.slug}` })),
    ]

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
