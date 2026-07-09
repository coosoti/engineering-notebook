import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')

  // Create admin user
  const adminEmail = 'admin@example.com'
  const adminPassword = 'Admin123!'

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password_hash: hashedPassword,
        role: 'admin'
      }
    })

    console.log('Admin user created:', adminUser.email)
  } else {
    console.log('Admin user already exists')
  }

  // Create sample projects
  const sampleProjects = [
    {
      title: 'Building a Scalable API with Node.js',
      slug: 'scalable-api-nodejs',
      summary: 'Learn how to build a scalable REST API using Node.js, Express, and MongoDB.',
      body: 'This is a sample project content. In a real implementation, this would contain detailed technical documentation about building a scalable API with Node.js.',
      status: 'published',
      tags: ['Node.js', 'API', 'Scalability'],
      tech_stack: ['Node.js', 'Express', 'MongoDB']
    },
    {
      title: 'Machine Learning Model Deployment',
      slug: 'ml-model-deployment',
      summary: 'Guide to deploying machine learning models in production environments.',
      body: 'This is a sample project content. In a real implementation, this would contain detailed technical documentation about deploying machine learning models in production.',
      status: 'published',
      tags: ['Machine Learning', 'Deployment', 'MLOps'],
      tech_stack: ['Python', 'TensorFlow', 'Docker', 'Kubernetes']
    }
  ]

  for (const projectData of sampleProjects) {
    const existingProject = await prisma.project.findUnique({
      where: { slug: projectData.slug }
    })

    if (!existingProject) {
      const project = await prisma.project.create({
        data: {
          ...projectData,
          author: {
            connect: {
              email: adminEmail
            }
          }
        }
      })

      console.log('Created project:', project.title)
    }
  }

  // Create sample tutorials
  const sampleTutorials = [
    {
      title: 'Getting Started with Docker',
      slug: 'getting-started-docker',
      summary: 'A beginner\'s guide to containerizing applications with Docker.',
      body: 'This is a sample tutorial content. In a real implementation, this would contain step-by-step instructions for getting started with Docker.',
      status: 'published',
      tags: ['Docker', 'Containers', 'DevOps']
    },
    {
      title: 'Introduction to Kubernetes',
      slug: 'introduction-kubernetes',
      summary: 'Learn the basics of Kubernetes orchestration.',
      body: 'This is a sample tutorial content. In a real implementation, this would contain step-by-step instructions for learning Kubernetes.',
      status: 'published',
      tags: ['Kubernetes', 'Orchestration', 'DevOps']
    }
  ]

  for (const tutorialData of sampleTutorials) {
    const existingTutorial = await prisma.tutorial.findUnique({
      where: { slug: tutorialData.slug }
    })

    if (!existingTutorial) {
      const tutorial = await prisma.tutorial.create({
        data: {
          ...tutorialData,
          author: {
            connect: {
              email: adminEmail
            }
          }
        }
      })

      console.log('Created tutorial:', tutorial.title)
    }
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
