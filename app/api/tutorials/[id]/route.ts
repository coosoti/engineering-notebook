import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params // Unwrap the Promise
    
    const tutorial = await prisma.tutorial.findUnique({
      where: { id },
    })

    if (!tutorial) {
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
    const body = await request.json()
    
    const tutorial = await prisma.tutorial.update({
      where: { id },
      data: body,
    })
    
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
    
    await prisma.tutorial.delete({
      where: { id },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}