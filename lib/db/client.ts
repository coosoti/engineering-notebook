import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined
}

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || ''
  if (!url) return url

  // If the URL already contains a query string, append with &, otherwise use ?
  const separator = url.includes('?') ? '&' : '?'
  if (!url.includes('pgbouncer=true')) {
    return `${url}${separator}pgbouncer=true`
  }
  return url
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
