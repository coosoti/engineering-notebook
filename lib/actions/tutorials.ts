'use server'

import { auth } from "@/lib/auth"
import * as tutorialService from "@/lib/services/tutorials"

export async function createTutorialAction(data: any) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
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
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  try {
    const tutorial = await tutorialService.updateTutorial(id, data, session.user?.id as string)
    return { success: true, tutorial }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteTutorialAction(id: string) {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') {
    throw new Error("Unauthorized")
  }

  try {
    await tutorialService.deleteTutorial(id, session.user?.id as string)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
