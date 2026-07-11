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
    title: `${formattedTag} Hub | Engineering Notebook`,
    description: `Discover all technical projects and tutorials focused on ${formattedTag} in the Engineering Notebook.`,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={jsonLd} />
      
      <header className="mb-12">
        <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Topic: {formattedTag}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Exploring all engineering projects and tutorials tagged with <span className="font-semibold text-indigo-600">{formattedTag}</span>.
        </p>
      </header>

      <div className="space-y-12">
        {projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Featured Projects
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {projects.length}
              </span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-500 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 mb-2 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{project.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {tutorials.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Related Tutorials
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {tutorials.length}
              </span>
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {tutorials.map((tutorial) => (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${tutorial.slug}`}
                  className="group block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-500 hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 mb-2 transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{tutorial.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
