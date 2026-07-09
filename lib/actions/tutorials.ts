'use server'

import { prisma } from "@/lib/db/client"
import { createAuditLog } from "@/lib/audit"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { generateSlug } from "@/utils/slug"
import { calculateReadTime } from "@/utils/content"
import { getClientIp } from "@/lib/server/get-client-ip"

export async function createTutorialAction(data: any) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  const slug = data.slug || generateSlug(data.title)
  const estimatedReadTime = data.body ? calculateReadTime(data.body) : 0

  const tutorial = await prisma.tutorial.create({
    data: {
      title: data.title,
      slug: slug,
      summary: data.summary,
      body: data.body,
      status: data.status || 'draft',
      estimated_read_time: estimatedReadTime,
      author_id: session.user?.id as string,
    }
  })

  await createAuditLog({
    user_id: session.user?.id as string,
    action: 'create',
    entity_type: 'Tutorial',
    entity_id: tutorial.id,
    metadata: { title: tutorial.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/tutorials')
  revalidatePath(`/tutorials/${slug}`)

  return { success: true, tutorial }
}

export async function updateTutorialAction(id: string, data: any) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  const updatedData = { ...data }
  if (data.body) {
    updatedData.estimated_read_time = calculateReadTime(data.body)
  }

  const tutorial = await prisma.tutorial.update({
    where: { id },
    data: updatedData
  })

  await createAuditLog({
    user_id: session.user?.id as string,
    action: 'update',
    entity_type: 'Tutorial',
    entity_id: tutorial.id,
    metadata: { title: tutorial.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/tutorials')
  revalidatePath(`/tutorials/${tutorial.slug}`)

  return { success: true, tutorial }
}

export async function deleteTutorialAction(id: string) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  const tutorial = await prisma.tutorial.delete({
    where: { id }
  })

  await createAuditLog({
    user_id: session.user?.id as string,
    action: 'delete',
    entity_type: 'Tutorial',
    entity_id: tutorial.id,
    metadata: { title: tutorial.title },
    ip_address: await getClientIp()
  })

  revalidatePath('/admin/tutorials')
  revalidatePath(`/tutorials/${tutorial.slug}`)

  return { success: true }
}
