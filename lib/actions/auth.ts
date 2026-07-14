'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/client"
import bcrypt from "bcryptjs"
import { toast } from "sonner"

export async function updatePasswordAction(data: {
  userId?: string,
  newPassword: string,
  token?: string
}) {
  try {
    const session = await auth()
    let targetUserId = data.userId

    // If no userId is provided, we are using the current session
    if (!targetUserId && session?.user) {
      targetUserId = session.user.id
    }

    // If a token is provided, we validate it first (for Forgot Password flow)
    if (data.token) {
      const user = await prisma.user.findFirst({
        where: {
          reset_token: data.token,
          reset_token_expiry: { gt: new Date() }
        } as any
      })

      if (!user) {
        return { success: false, error: "Invalid or expired reset token" }
      }
      targetUserId = user.id
    }

    if (!targetUserId) {
      return { success: false, error: "User not identified" }
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10)

    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        password_hash: passwordHash,
        must_change_password: false,
        reset_token: null,
        reset_token_expiry: null
      }
    })

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
