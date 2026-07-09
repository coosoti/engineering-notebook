import { prisma } from "@/lib/db/client"

export async function createAuditLog(data: {
  user_id: string
  action: string
  entity_type: string
  entity_id?: string
  metadata?: any
  ip_address?: string
}) {
  return await prisma.auditLog.create({
    data
  })
}