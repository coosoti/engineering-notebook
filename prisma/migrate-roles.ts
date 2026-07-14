import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Migrating roles from SUPERUSER to ADMIN...')

  const result = await prisma.user.updateMany({
    where: {
      role: 'SUPERUSER' as any,
    },
    data: {
      role: 'ADMIN',
    },
  })

  console.log(`Successfully migrated ${result.count} users.`)
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
