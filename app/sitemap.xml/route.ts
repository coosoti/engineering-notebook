import { getProjects } from "@/lib/db/projects"
import { getTutorials } from "@/lib/db/tutorials"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Get all projects and tutorials
  const projects = await getProjects()
  const tutorials = await getTutorials()

  const staticPages = [
    '',
    '/projects',
    '/tutorials',
    '/about'
  ]

  const projectUrls = projects.map(project => `/projects/${project.slug}`)
  const tutorialUrls = tutorials.map(tutorial => `/tutorials/${tutorial.slug}`)

  const allUrls = [...staticPages, ...projectUrls, ...tutorialUrls]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>
`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}