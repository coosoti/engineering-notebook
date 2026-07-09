'use server'

import { headers } from 'next/headers'
import { createAuditLog as createAuditLogFn } from "@/lib/db/audit-log"

// Re-export the audit log function
export { createAuditLogFn as createAuditLog }

// Export the IP getter function
export async function getClientIp() {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = headerList.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return 'unknown'
}