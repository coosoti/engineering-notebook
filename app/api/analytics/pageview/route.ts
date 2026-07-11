import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      path,
      content_type,
      content_id,
      session_id,
      duration
    } = body

    if (!path || !session_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. If duration is provided, we are updating the time spent on the page
    if (duration !== undefined) {
      // We find the most recent PageView for this session and path to update its duration
      const lastView = await prisma.pageView.findFirst({
        where: { session_id, path },
        orderBy: { created_at: 'desc' }
      })

      if (lastView) {
        await prisma.pageView.update({
          where: { id: lastView.id },
          data: { time_on_page_sec: duration }
        })
      }
      return NextResponse.json({ success: true })
    }

    // 2. Otherwise, record a new page view
    const headerList = await headers()
    const userAgent = headerList.get('user-agent') || 'unknown'
    const referrer = headerList.get('referer') || null

    // Basic device type detection
    let device_type = 'desktop'
    if (userAgent.toLowerCase().includes('mobile')) device_type = 'mobile'
    else if (userAgent.toLowerCase().includes('tablet')) device_type = 'tablet'

    await prisma.pageView.create({
      data: {
        path,
        content_type,
        content_id,
        session_id,
        referrer,
        device_type,
        country: headerList.get('x-vercel-ip-country') || 'unknown'
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
