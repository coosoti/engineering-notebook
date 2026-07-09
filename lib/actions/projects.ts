"use server"

import { auth } from "@/lib/auth"
import * as projectService from "@/lib/services/projects"
import { ProjectInput } from "@/lib/types/projects"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "@/lib/audit"
import { getClientIp } from "@/lib/server/get-client-ip"

export async function createProjectAction(data: ProjectInput) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  try {
    const project = await projectService.createProject(data, session.user?.id as string)
    
    await createAuditLog({
      user_id: session.user?.id as string,
      action: 'create',
      entity_type: 'Project',
      entity_id: project.id,
      metadata: { title: project.title },
      ip_address: await getClientIp()
    })

    revalidatePath('/admin/projects')
    revalidatePath(`/projects/${project.slug}`)

    return { success: true, project }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  try {
    const project = await projectService.updateProject(id, data, session.user?.id as string)
    
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
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProjectAction(id: string) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  try {
    const project = await projectService.deleteProject(id, session.user?.id as string)
    
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
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
