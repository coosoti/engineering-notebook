'use server'

import { auth } from "@/lib/auth"
import * as projectService from "@/lib/services/projects"
import { ProjectInput } from "@/lib/types/projects"

export async function createProjectAction(data: ProjectInput) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  try {
    const project = await projectService.createProject(data, session.user?.id as string)
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
    await projectService.deleteProject(id, session.user?.id as string)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
