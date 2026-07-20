'use server'

import { auth } from "@/lib/auth"
import * as tutorialService from "@/lib/services/tutorials"
import { Permissions } from "@/lib/permissions"
import { prisma } from "@/lib/db/client"

export async function createTutorialAction(data: any) {
  const session = await auth()
  if (!session || !Permissions.canCreateContent({ id: session.user?.id as string, role: session.user?.role as any })) {
    throw new Error("Unauthorized")
  }

  try {
    const tutorial = await tutorialService.createTutorial(data, session.user?.id as string)
    return { success: true, tutorial }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateTutorialAction(id: string, data: any) {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }
  const existing = await prisma.tutorial.findUnique({ where: { id }, select: { author_id: true } })
  if (!existing || !Permissions.canEditOwn({ id: session.user.id, role: session.user.role as any }, existing.author_id)) throw new Error("Unauthorized")

  try {
    const tutorial = await tutorialService.updateTutorial(id, data, session.user?.id as string)
    return { success: true, tutorial }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteTutorialAction(id: string) {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }
  const existing = await prisma.tutorial.findUnique({ where: { id }, select: { author_id: true } })
  if (!existing || !Permissions.canEditOwn({ id: session.user.id, role: session.user.role as any }, existing.author_id)) throw new Error("Unauthorized")

  try {
    await tutorialService.deleteTutorial(id, session.user?.id as string)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
