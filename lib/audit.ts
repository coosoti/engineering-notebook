import 'server-only'
import { createAuditLog as prismaCreateAuditLog } from "@/lib/db/audit-log"

export async function createAuditLog(data: {
  user_id: string
  action: string
  entity_type: string
  entity_id?: string
  metadata?: any
  ip_address?: string
}) {
  return await prismaCreateAuditLog(data)
}
