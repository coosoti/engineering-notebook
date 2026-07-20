import { prisma } from "@/lib/db/client"
import { Project } from "@prisma/client"

export async function getProjects(onlyPublished = false) {
  return await prisma.project.findMany({
    where: onlyPublished ? { status: "published" } : {},
    orderBy: { created_at: "desc" },
    include: { author: true }
  })
}

export async function getProjectsByTag(tag: string, onlyPublished = true) {
  return await prisma.project.findMany({
    where: {
      ...(onlyPublished ? { status: "published" } : {}),
      tags: {
        has: tag
      }
    },
    orderBy: { created_at: "desc" },
    include: { author: true }
  })
}

export async function getProjectBySlug(slug: string) {
  return await prisma.project.findUnique({
    where: { slug, status: "published" },
    include: { author: true }
  })
}

export async function createProject(data: any) {
  return await prisma.project.create({ data })
}

export async function updateProject(id: string, data: any) {
  return await prisma.project.update({
    where: { id },
    data
  })
}

export async function deleteProject(id: string) {
  return await prisma.project.delete({ where: { id } })
}