import { prisma } from "@/lib/db/client"
import { Tutorial } from "@prisma/client"

export async function getTutorials() {
  return await prisma.tutorial.findMany({
    orderBy: { created_at: "desc" },
    include: { author: true }
  })
}

export async function getTutorialBySlug(slug: string) {
  return await prisma.tutorial.findUnique({
    where: { slug },
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