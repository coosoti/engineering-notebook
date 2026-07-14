import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function sync() {
  try {
    console.log('Syncing database columns...')
    // Use raw queries to bypass Prisma Client type checks during migration
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "must_change_password" BOOLEAN DEFAULT true;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "reset_token" TEXT;`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "reset_token_expiry" TIMESTAMP WITH TIME ZONE;`)
    console.log('✅ Database synced successfully!')
  } catch (e) {
    console.error('Sync failed:', e)
  } finally {
    await prisma.$disconnect()
  }
}

sync()
