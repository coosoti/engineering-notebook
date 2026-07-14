import 'server-only'
import { prisma } from "@/lib/db/client"
import { createAuditLog } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { generateSlug } from "@/utils/slug"
import { calculateReadTime } from "@/utils/content"
import { getClientIp } from "@/lib/server/get-client-ip"

export async function createTutorial(data: any, userId: string) {
  const slug = data.slug || generateSlug(data.title)
  const estimatedReadTime = data.body ? calculateReadTime(data.body) : 0

  // Parse tags from comma-separated string to array
  const tags = typeof data.tags === 'string'
    ? data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '')
    : data.tags

  const tutorial = await prisma.tutorial.create({
    data: {
      title: data.title,
      slug: slug,
      summary: data.summary,
      body: data.body,
      status: data.status || 'draft',
      estimated_read_time: estimatedReadTime,
      author_id: userId,
      series_id: data.series_id || null,
      series_order: data.series_order ? parseInt(data.series_order) : null,
      tags: tags || [],
      cover_image: data.cover_image || null,
    }
  })

  await createAuditLog({
    user_id: userId,
    action: 'create',
    entity_type: 'Tutorial',
    entity_id: tutorial.id,
    metadata: { title: tutorial.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/tutorials')
  revalidatePath(`/tutorials/${slug}`)

  return tutorial
}

export async function updateTutorial(id: string, data: any, userId: string) {
  const updatedData = { ...data }
  if (data.body) {
    updatedData.estimated_read_time = calculateReadTime(data.body)
  }

  // Parse tags from comma-separated string to array
  if (data.tags && typeof data.tags === 'string') {
    updatedData.tags = data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t !== '')
  }

  if (data.series_order) {
    updatedData.series_order = parseInt(data.series_order)
  }

  const tutorial = await prisma.tutorial.update({
    where: { id },
    data: updatedData
  })

  await createAuditLog({
    user_id: userId,
    action: 'update',
    entity_type: 'Tutorial',
    entity_id: tutorial.id,
    metadata: { title: tutorial.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/tutorials')
  revalidatePath(`/tutorials/${tutorial.slug}`)

  return tutorial
}

export async function deleteTutorial(id: string, userId: string) {
  const tutorial = await prisma.tutorial.delete({
    where: { id }
  })

  await createAuditLog({
    user_id: userId,
    action: 'delete',
    entity_type: 'Tutorial',
    entity_id: tutorial.id,
    metadata: { title: tutorial.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/tutorials')
  revalidatePath(`/tutorials/${tutorial.slug}`)

  return tutorial
}
