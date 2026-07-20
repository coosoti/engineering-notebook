import 'server-only'
import { prisma } from "@/lib/db/client"
import { generateSlug } from "@/utils/slug"
import { ProjectInput } from "@/lib/types/projects"
import { sanitizeHtml } from "@/lib/security"

export async function createProject(data: ProjectInput, userId: string) {
  const slug = data.slug || generateSlug(data.title)

  const project = await prisma.project.create({
    data: {
      ...data,
      body: sanitizeHtml(data.body),
      slug,
      author_id: userId,
    }
  })



  return project
}

export async function updateProject(id: string, data: ProjectInput, userId: string) {
  const {
    title, summary, body, cover_image, status,
    tags, tech_stack, github_url, demo_url,
    seo_title, seo_description, og_image, slug
  } = data

  const project = await prisma.project.update({
    where: { id },
    data: {
      title, summary, body: sanitizeHtml(body), cover_image, status,
      tags, tech_stack, github_url, demo_url,
      seo_title, seo_description, og_image, slug
    }
  })

  return project
}

export async function deleteProject(id: string, userId: string) {
  const project = await prisma.project.delete({
    where: { id }
  })

  return project
}
