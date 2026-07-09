'use server'

import { prisma } from "@/lib/db/client"
import { createAuditLog } from "@/lib/audit"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { generateSlug } from "@/utils/slug"
import { getClientIp } from "@/lib/server/get-client-ip"
import { ProjectInput } from "@/lib/types/projects"

export async function createProjectAction(data: ProjectInput) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  const slug = data.slug || generateSlug(data.title)

  const project = await prisma.project.create({
    data: {
      ...data,
      slug,
      author_id: session.user?.id as string,
    }
  })

  await createAuditLog({
    user_id: session.user?.id as string,
    action: 'create',
    entity_type: 'Project',
    entity_id: project.id,
    metadata: { title: project.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/projects')
  revalidatePath(`/projects/${slug}`)

  return { success: true, project }
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

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
    user_id: session.user?.id as string,
    action: 'update',
    entity_type: 'Project',
    entity_id: project.id,
    metadata: { title: project.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/projects')
  revalidatePath(`/projects/${project.slug}`)

  return { success: true, project }
}

export async function deleteProjectAction(id: string) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  const project = await prisma.project.delete({
    where: { id }
  })

  await createAuditLog({
    user_id: session.user?.id as string,
    action: 'delete',
    entity_type: 'Project',
    entity_id: project.id,
    metadata: { title: project.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/projects')
  revalidatePath(`/projects/${project.slug}`)

  return { success: true }
}
