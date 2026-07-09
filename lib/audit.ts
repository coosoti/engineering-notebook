'use server'

import { headers } from 'next/headers'

export { createAuditLog } from "@/lib/db/audit-log"

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
