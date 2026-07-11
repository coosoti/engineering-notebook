import { getProjectBySlug } from "@/lib/db/projects"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { generateSEOConfig } from "@/utils/seo"
import { highlightHtml } from "@/lib/utils/highlight"
import { generateProjectSchema } from "@/lib/utils/seo-schema"
import JsonLd from "@/components/seo/JsonLd"
import Link from "next/link"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return generateSEOConfig({
    title: project.seo_title || project.title,
    description: project.seo_description || project.summary,
    url: `https://yourdomain.com/projects/${project.slug}`,
    image: project.og_image ?? undefined,
  })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const highlightedBody = await highlightHtml(project.body)
  const jsonLd = generateProjectSchema(project)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {project.title}
          </h1>
          <div className="mt-4 flex items-center">
            <div className="shrink-0">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {project.status}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {project.author?.name || project.author?.email}
              </p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={project.created_at.toString()}>
                  {new Date(project.created_at).toLocaleDateString()}
                </time>
                {project.updated_at && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <time dateTime={project.updated_at.toString()}>
                      Updated {new Date(project.updated_at).toLocaleDateString()}
                    </time>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            {project.summary}
          </p>

          <div
            className="mt-6 text-gray-700"
            dangerouslySetInnerHTML={{ __html: highlightedBody }}
          />
        </div>

        {(project.tech_stack.length > 0 || project.tags.length > 0) && (
          <div className="mt-8">
            {project.tech_stack.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900">Technologies</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tech_stack.map((tech: string) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900">Tags</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(project.github_url || project.demo_url) && (
          <div className="mt-8 flex gap-4">
            {project.github_url && (
              <a
                href={project.github_url}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View on GitHub
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View Demo
              </a>
            )}
          </div>
        )}
      </article>
    </div>
  )
}
