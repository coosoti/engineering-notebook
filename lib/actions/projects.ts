'use server'

import { auth } from "@/lib/auth"
import * as projectService from "@/lib/services/projects"
import { ProjectInput } from "@/lib/types/projects"
import { Permissions } from "@/lib/permissions"
import { prisma } from "@/lib/db/client"
import { createAuditLog } from "@/lib/audit"
import { getClientIp } from "@/lib/server/get-client-ip"

export async function createProjectAction(data: ProjectInput) {
  const session = await auth()
  if (!session || !Permissions.canCreateContent({ id: session.user?.id as string, role: session.user?.role as any })) {
    throw new Error("Unauthorized")
  }

  try {
    if (data.status === 'published' && !Permissions.canPublish({ id: session.user!.id, role: session.user!.role as any })) {
      throw new Error("Unauthorized")
    }
    const project = await projectService.createProject(data, session.user?.id as string)
    await createAuditLog({ user_id: session.user!.id, action: 'create', entity_type: 'Project', entity_id: project.id, metadata: { title: project.title }, ip_address: await getClientIp() })
    return { success: true, project }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const existing = await prisma.project.findUnique({ where: { id }, select: { author_id: true } })
  if (!existing || !Permissions.canEditOwn({ id: session.user!.id, role: session.user!.role as any }, existing.author_id)) throw new Error("Unauthorized")
  if (data.status === 'published' && !Permissions.canPublish({ id: session.user!.id, role: session.user!.role as any })) throw new Error("Unauthorized")

  try {
    const updated = await projectService.updateProject(id, data, session.user?.id as string)
    await createAuditLog({ user_id: session.user!.id, action: 'update', entity_type: 'Project', entity_id: id, metadata: { title: updated.title }, ip_address: await getClientIp() })
    return { success: true, project: updated }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProjectAction(id: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  const existing = await prisma.project.findUnique({ where: { id }, select: { author_id: true, title: true } })
  if (!existing || !Permissions.canEditOwn({ id: session.user!.id, role: session.user!.role as any }, existing.author_id)) throw new Error("Unauthorized")

  try {
    await projectService.deleteProject(id, session.user?.id as string)
    await createAuditLog({ user_id: session.user!.id, action: 'delete', entity_type: 'Project', entity_id: id, metadata: { title: existing.title }, ip_address: await getClientIp() })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
