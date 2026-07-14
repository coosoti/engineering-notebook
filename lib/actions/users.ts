'use server'

import { auth } from "@/lib/auth"
import * as userService from "@/lib/services/users"
import { Permissions } from "@/lib/permissions"
import { UserCreateInput, UserUpdateInput } from "@/lib/services/users"

export async function createUserAction(data: UserCreateInput) {
  const session = await auth()
  if (!session || !Permissions.canManageUsers({ id: session.user?.id as string, role: session.user?.role as any })) {
    throw new Error("Unauthorized: Only admins can create users")
  }

  try {
    const result = await userService.createUser(data)
    return {
      success: true,
      user: result.user,
      emailSent: result.emailSent
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateUserRoleAction(id: string, role: any) {
  const session = await auth()
  if (!session || !Permissions.canManageUsers({ id: session.user?.id as string, role: session.user?.role as any })) {
    throw new Error("Unauthorized: Only admins can change roles")
  }

  try {
    await userService.updateUser(id, { role })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteUserAction(id: string) {
  const session = await auth()
  if (!session || !Permissions.canManageUsers({ id: session.user?.id as string, role: session.user?.role as any })) {
    throw new Error("Unauthorized: Only admins can delete users")
  }

  try {
    await userService.deleteUser(id)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
