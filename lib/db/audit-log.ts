import { prisma } from "@/lib/db/client"

export async function getAuditLogs() {
  return await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })
}

export async function createAuditLog(data: {
  user_id: string
  action: string
  entity_type: string
  entity_id?: string
  metadata?: any
  ip_address?: string
}) {
  return await prisma.auditLog.create({
    data: {
      user_id: data.user_id,
      action: data.action,
      entity_type: data.entity_type,
      entity_id: data.entity_id || '', // Provide default
      metadata: data.metadata || {},
      ip_address: data.ip_address || 'unknown',
    }
  })
}
