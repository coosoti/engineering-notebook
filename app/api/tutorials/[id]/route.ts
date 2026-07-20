import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { Permissions } from "@/lib/permissions"
import * as tutorialService from "@/lib/services/tutorials"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Unwrap the Promise
    
    const session = await auth()
    const tutorial = await prisma.tutorial.findUnique({ where: { id } })

    if (!tutorial || !session?.user?.id || !Permissions.canEditOwn({ id: session.user.id, role: session.user.role as any }, tutorial.author_id)) {
      return NextResponse.json({ error: "Tutorial not found" }, { status: 404 })
    }

    return NextResponse.json(tutorial)
  } catch (error) {
    console.error("Error fetching tutorial:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// If you also have PUT, PATCH, or DELETE methods, update them similarly:
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    const existing = await prisma.tutorial.findUnique({ where: { id }, select: { author_id: true } })
    if (!existing || !session?.user?.id || !Permissions.canEditOwn({ id: session.user.id, role: session.user.role as any }, existing.author_id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    const body = await request.json()
    const tutorial = await tutorialService.updateTutorial(id, body, session.user.id)
    
    return NextResponse.json(tutorial)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const session = await auth()
    const existing = await prisma.tutorial.findUnique({ where: { id }, select: { author_id: true } })
    if (!existing || !session?.user?.id || !Permissions.canEditOwn({ id: session.user.id, role: session.user.role as any }, existing.author_id)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    await tutorialService.deleteTutorial(id, session.user.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
