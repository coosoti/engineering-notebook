import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    // We return success even if user not found to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." })
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 3600000) // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        reset_token: token,
        reset_token_expiry: expiry
      }
    })

    // In production, you'd send an email here.
    // For now, we'll log it to the server console for testing.
    const resetLink = `https://yourdomain.com/reset-password/${token}`
    console.log(`[PASSWORD RESET] Email: ${email} | Link: ${resetLink}`)

    return NextResponse.json({
      success: true,
      message: "Reset link sent to email",
      debug_link: resetLink // Only for dev purposes
    })
  } catch (error) {
    return NextResponse.json({ error: "An internal error occurred" }, { status: 500 })
  }
}
