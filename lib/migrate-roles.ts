import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateRoles() {
  try {
    console.log('Migrating legacy roles to SUPERUSER...')

    // Use raw SQL to bypass the Enum type check during the update
    await prisma.$executeRawUnsafe(`UPDATE "User" SET role = 'SUPERUSER' WHERE role = 'admin';`)

    console.log('✅ Role migration completed successfully!')
  } catch (e) {
    console.error('Migration failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

migrateRoles()
