import { getProjectsByTag } from "@/lib/db/projects"
import { getTutorialsByTag } from "@/lib/db/tutorials"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ "tag-slug": string }> }): Promise<Metadata> {
  const { "tag-slug": tag } = await params
  return {
    title: `Content tagged with ${tag} | Engineering Notebook`,
    description: `Browse all projects and tutorials tagged with ${tag}`,
  }
}

export default async function TagPage({ params }: { params: Promise<{ "tag-slug": string }> }) {
  const { "tag-slug": tag } = await params

  const projects = await getProjectsByTag(tag)
  const tutorials = await getTutorialsByTag(tag)

  if (projects.length === 0 && tutorials.length === 0) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Tag: {tag}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Exploring all content related to {tag}.
        </p>
      </header>

      <div className="space-y-12">
        {projects.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{project.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {tutorials.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tutorials</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {tutorials.map((tutorial) => (
                <Link
                  key={tutorial.id}
                  href={`/tutorials/${tutorial.slug}`}
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">{tutorial.title}</h3>
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
