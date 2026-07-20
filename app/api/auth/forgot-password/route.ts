import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"
import crypto from "crypto"
import { headers } from "next/headers"

export async function POST(req: Request) {
  try {
    // Rate limiting: simple IP-based in-memory store (use Redis/Upstash in production)
    const headerList = await headers()
    const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "unknown"

    // Simple in-memory rate limit (replace with Redis in production)
    const rateLimitKey = `forgot-password:${ip}`
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 3 // 3 requests per 15 minutes

    // In production, use a proper rate limiter like @upstash/ratelimit
    // For now, we'll skip in-memory rate limiting as it doesn't persist across serverless invocations
    // TODO: Implement proper rate limiting with Redis/Upstash

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
    // For now, we'll log it to the server console for testing (without exposing token in response).
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`
    console.log(`[PASSWORD RESET] Email: ${email} | Link: ${resetLink}`)

    return NextResponse.json({
      success: true,
      message: "If an account exists, a reset link has been sent."
    })
  } catch (error) {
    return NextResponse.json({ error: "An internal error occurred" }, { status: 500 })
  }
}
