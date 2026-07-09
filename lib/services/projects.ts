import 'server-only'
import { prisma } from "@/lib/db/client"
import { generateSlug } from "@/utils/slug"
import { ProjectInput } from "@/lib/types/projects"

export async function createProject(data: ProjectInput, userId: string) {
  const slug = data.slug || generateSlug(data.title)

  const project = await prisma.project.create({
    data: {
      ...data,
      slug,
      author_id: userId,
    }
  })

  await createAuditLog({
    user_id: userId,
    action: 'create',
    entity_type: 'Project',
    entity_id: project.id,
    metadata: { title: project.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/projects')
  revalidatePath(`/projects/${slug}`)

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
      title, summary, body, cover_image, status,
      tags, tech_stack, github_url, demo_url,
      seo_title, seo_description, og_image, slug
    }
  })

  await createAuditLog({
    user_id: userId,
    action: 'update',
    entity_type: 'Project',
    entity_id: project.id,
    metadata: { title: project.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/projects')
  revalidatePath(`/projects/${project.slug}`)

  return project
}

export async function deleteProject(id: string, userId: string) {
  const project = await prisma.project.delete({
    where: { id }
  })

  await createAuditLog({
    user_id: userId,
    action: 'delete',
    entity_type: 'Project',
    entity_id: project.id,
    metadata: { title: project.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/projects')
  revalidatePath(`/projects/${project.slug}`)

  return project
}
