import { prisma } from "@/lib/db/client"

export async function getSeries(onlyPublished = true) {
  return await prisma.series.findMany({
    where: onlyPublished ? { status: "published" } : {},
    orderBy: { created_at: 'desc' }
  })
}

export async function getSeriesById(id: string) {
  return await prisma.series.findUnique({
    where: { id },
    include: { tutorials: true }
  })
}

export async function getSeriesBySlug(slug: string) {
  return await prisma.series.findUnique({
    where: { slug, status: "published" },
    include: { tutorials: { orderBy: { series_order: 'asc' } } }
  })
}