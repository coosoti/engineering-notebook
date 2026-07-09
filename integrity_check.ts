import { prisma } from './lib/db/client'

async function checkIntegrity() {
  console.log('Checking Tutorial -> User integrity...')
  const tutorials = await prisma.tutorial.findMany({
    select: { id: true, author_id: true }
  })

  let orphans = 0
  for (const t of tutorials) {
    const user = await prisma.user.findUnique({
      where: { id: t.author_id }
    })
    if (!user) {
      console.log(`Orphaned Tutorial found: ID ${t.id} has non-existent author ${t.author_id}`)
      orphans++
    }
  }
  console.log(`Total orphans: ${orphans}`)
}

checkIntegrity().catch(console.error)
