import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const tutorials = await prisma.tutorial.findMany({
      select: { id: true, title: true },
      orderBy: { title: 'asc' }
    })
    return NextResponse.json(tutorials)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}