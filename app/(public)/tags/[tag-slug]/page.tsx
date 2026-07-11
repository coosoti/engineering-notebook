import { getProjectsByTag } from "@/lib/db/projects"
import { getTutorialsByTag } from "@/lib/db/tutorials"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import JsonLd from "@/components/seo/JsonLd"

export async function generateMetadata({ params }: { params: Promise<{ "tag-slug": string }> }): Promise<Metadata> {
  const { "tag-slug": tag } = await params
  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1)
  return {
    title: `${formattedTag} Knowledge Hub | Engineering Notebook`,
    description: `Explore all projects and tutorials related to ${formattedTag} in the Engineering Notebook.`,
  }
}

export default async function TagPage({ params }: { params: Promise<{ "tag-slug": string }> }) {
  const { "tag-slug": tag } = await params
  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1)

  const projects = await getProjectsByTag(tag)
  const tutorials = await getTutorialsByTag(tag)

  if (projects.length === 0 && tutorials.length === 0) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${formattedTag} Topic Hub`,
    "description": `A curated collection of projects and tutorials about ${formattedTag}`,
    "url": `https://yourdomain.com/tags/${tag}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        ...projects.map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `https://yourdomain.com/projects/${p.slug}`,
          "name": p.title
        })),
        ...tutorials.map((t, i) => ({
          "@type": "ListItem",
          "position": projects.length + i + 1,
          "url": `https://yourdomain.com/tutorials/${t.slug}`,
          "name": t.title
        }))
      ]
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <JsonLd data={jsonLd} />
      
      {/* Topic Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-24 border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-6 inline-block">
            ← Back to Notebook
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            {formattedTag} <span className="text-indigo-600">Knowledge Hub</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            A curated collection of engineering projects and technical guides focused on {formattedTag}.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-20">
          {/* Projects Gallery */}
          {projects.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Deep-Dive Projects</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                  {projects.length}
                </span>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group relative p-6 bg-white border border-gray-200 rounded-2xl transition-all hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Project</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
                      {project.summary}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore Case Study <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tutorials Gallery */}
          {tutorials.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Technical Guides</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {tutorials.length}
                </span>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {tutorials.map((tutorial) => (
                  <Link
                    key={tutorial.id}
                    href={`/tutorials/${tutorial.slug}`}
                    className="group relative p-6 bg-white border border-gray-200 rounded-2xl transition-all hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 duration-300"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Tutorial</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {tutorial.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
                      {tutorial.summary}
                    </p>
                    <div className="flex items-center text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read Guide <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
