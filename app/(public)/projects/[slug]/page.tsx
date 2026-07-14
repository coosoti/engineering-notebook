import { getProjectBySlug } from "@/lib/db/projects"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { generateSEOConfig } from "@/utils/seo"
import { highlightHtml } from "@/lib/utils/highlight"
import { generateProjectSchema } from "@/lib/utils/seo-schema"
import JsonLd from "@/components/seo/JsonLd"
import Link from "next/link"
import TableOfContents from "@/components/TableOfContents"
import { extractHeadings, injectHeadingIds } from "@/lib/utils/toc"
import { sanitizeHtml } from "@/lib/security"

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

  const rawBody = project.body
  const headings = extractHeadings(rawBody)
  const bodyWithIds = injectHeadingIds(rawBody)
  const highlightedBody = await highlightHtml(bodyWithIds)
  const jsonLd = generateProjectSchema(project)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={jsonLd} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          <div className="flex-1 max-w-4xl">
            <article>
              <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
                  {project.title}
                </h1>
                <div className="mt-6 flex items-center gap-4">
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {project.author?.name || project.author?.email}
                    </p>
                    <span className="text-slate-300">•</span>
                    <div className="flex space-x-1 text-sm text-slate-500">
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

              <div className="flex gap-12">
                <div className="prose prose-lg max-w-none flex-1">
                  <p className="text-xl text-slate-500 mb-12 leading-relaxed font-light">
                    {project.summary}
                  </p>

                  <div
                    className="mt-6 text-slate-800"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(highlightedBody) }}
                  />
                </div>

                {headings.length > 0 && (
                  <div className="hidden xl:block w-64 shrink-0">
                    <TableOfContents headings={headings} />
                  </div>
                )}
              </div>

              {(project.tech_stack.length > 0 || project.tags.length > 0) && (
                <div className="mt-20 pt-12 border-t border-slate-100">
                  {project.tech_stack.length > 0 && (
                    <div className="mb-10">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Technologies</h3>
                      <div className="flex flex-wrap gap-3">
                        {project.tech_stack.map((tech: string) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Tags</h3>
                      <div className="flex flex-wrap gap-3">
                        {project.tags.map((tag: string) => (
                          <Link
                            key={tag}
                            href={`/tags/${tag}`}
                            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
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
                <div className="mt-12 flex gap-4">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      className="inline-flex items-center px-6 py-3 border border-slate-200 text-sm font-semibold rounded-full text-slate-900 bg-white hover:bg-slate-50 transition-all shadow-sm"
                    >
                      View on GitHub
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-full shadow-sm text-background bg-foreground hover:opacity-90 transition-all"
                    >
                      View Demo
                    </a>
                  )}
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
