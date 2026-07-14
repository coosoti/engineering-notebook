import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db/client"
import { NextResponse } from "next/server"
import { Permissions } from "@/lib/permissions"

export async function GET() {
  const session = await auth()

  if (!session || !Permissions.canManageUsers({ id: session.user?.id as string, role: session.user?.role as any })) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        // explicitly omit password_hash
      },
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
