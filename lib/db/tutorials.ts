import { prisma } from "@/lib/db/client"
import { Tutorial } from "@prisma/client"

export async function getTutorials(onlyPublished = false) {
  return await prisma.tutorial.findMany({
    where: onlyPublished ? { status: "published" } : {},
    orderBy: { created_at: "desc" },
    include: { author: true }
  })
}

export async function getAdjacentTutorials(seriesId: string, currentOrder: number) {
  const [prev, next] = await Promise.all([
    prisma.tutorial.findFirst({
      where: {
        series_id: seriesId,
        series_order: { lt: currentOrder }
      },
      orderBy: { series_order: 'desc' },
      include: { author: true }
    }),
    prisma.tutorial.findFirst({
      where: {
        series_id: seriesId,
        series_order: { gt: currentOrder }
      },
      orderBy: { series_order: 'asc' },
      include: { author: true }
    })
  ])

  return { prev, next }
}

export async function getTutorialsByTag(tag: string) {
  return await prisma.tutorial.findMany({
    where: {
      status: "published",
      tags: {
        has: tag
      }
    },
    orderBy: { created_at: "desc" },
    include: { author: true }
  })
}

export async function getTutorialBySlug(slug: string) {
  return await prisma.tutorial.findUnique({
    where: { slug, status: "published" },
    include: {
      author: true,
      series: true
    }
  })
}

export async function createTutorial(data: any) {
  return await prisma.tutorial.create({ data })
}

export async function updateTutorial(id: string, data: any) {
  return await prisma.tutorial.update({
    where: { id },
    data
  })
}

export async function deleteTutorial(id: string) {
  return await prisma.tutorial.delete({ where: { id } })
}