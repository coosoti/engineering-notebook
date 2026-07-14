import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  const adminEmail = 'admin@example.com'
  const adminPassword = 'Password123!'

  // 1. Create/Update Superuser
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: adminEmail,
        password_hash: hashedPassword,
        role: 'ADMIN',
        must_change_password: false,
      }
    })
    console.log('✅ Admin created:', adminEmail)
  } else {
    console.log('✅ Admin already exists')
  }

  // 2. Create sample projects
  const sampleProjects = [
    {
      title: 'Building a Scalable API with Node.js',
      slug: 'scalable-api-nodejs',
      summary: 'Learn how to build a scalable REST API using Node.js, Express, and MongoDB.',
      body: 'This is a sample project content.',
      status: 'published',
      tags: ['Node.js', 'API', 'Scalability'],
      tech_stack: ['Node.js', 'Express', 'MongoDB']
    },
    {
      title: 'Machine Learning Model Deployment',
      slug: 'ml-model-deployment',
      summary: 'Guide to deploying machine learning models in production environments.',
      body: 'This is a sample project content.',
      status: 'published',
      tags: ['Machine Learning', 'Deployment', 'MLOps'],
      tech_stack: ['Python', 'TensorFlow', 'Docker', 'Kubernetes']
    }
  ]

  for (const projectData of sampleProjects) {
    await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
      create: {
        ...projectData,
        author: { connect: { email: adminEmail } }
      }
    })
  }
  console.log('✅ Sample projects seeded')

  // 3. Create sample tutorials
  const sampleTutorials = [
    {
      title: 'Getting Started with Docker',
      slug: 'getting-started-docker',
      summary: 'A beginner\'s guide to containerizing applications with Docker.',
      body: 'This is a sample tutorial content.',
      status: 'published',
      tags: ['Docker', 'Containers', 'DevOps']
    },
    {
      title: 'Introduction to Kubernetes',
      slug: 'introduction-kubernetes',
      summary: 'Learn the basics of Kubernetes orchestration.',
      body: 'This is a sample tutorial content.',
      status: 'published',
      tags: ['Kubernetes', 'Orchestration', 'DevOps']
    }
  ]

  for (const tutorialData of sampleTutorials) {
    await prisma.tutorial.upsert({
      where: { slug: tutorialData.slug },
      update: {},
      create: {
        ...tutorialData,
        author: { connect: { email: adminEmail } }
      }
    })
  }
  console.log('✅ Sample tutorials seeded')

  console.log('🚀 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
