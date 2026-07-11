import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://engineering-notebook.vercel.app'

  // Fetch all published projects
  const projects = await prisma.project.findMany({
    where: { status: 'published' },
    select: { slug: true, updated_at: true }
  })

  // Fetch all published tutorials
  const tutorials = await prisma.tutorial.findMany({
    where: { status: 'published' },
    select: { slug: true, updated_at: true }
  })

  // Fetch all published series
  const series = await prisma.series.findMany({
    where: { status: 'published' },
    select: { slug: true, updated_at: true }
  })

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    ...projects.map(p => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: p.updated_at,
    })),
    ...tutorials.map(t => ({
      url: `${baseUrl}/tutorials/${t.slug}`,
      lastModified: t.updated_at,
    })),
    ...series.map(s => ({
      url: `${baseUrl}/series/${s.slug}`,
      lastModified: s.updated_at,
    })),
  ]
}