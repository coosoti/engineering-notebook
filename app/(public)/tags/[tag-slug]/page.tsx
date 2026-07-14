import { getProjectsByTag } from "@/lib/db/projects"
import { getTutorialsByTag } from "@/lib/db/tutorials"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import JsonLd from "@/components/seo/JsonLd"
import Card from "@/components/ui/Card"

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
    <div className="min-h-screen bg-[#f2f2f0] text-slate-900">
      <JsonLd data={jsonLd} />

      {/* Topic Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="text-sm font-medium text-primary hover:opacity-80 mb-6 inline-block transition-all">
            ← Back to Notebook
          </Link>
          <h1 className="text-5xl font-extrabold text-slate-900 sm:text-6xl mb-4">
            {formattedTag} <span className="text-primary">Knowledge Hub</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed">
            A curated collection of engineering projects and technical guides focused on {formattedTag}.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-24">
          {/* Projects Gallery */}
          {projects.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Deep-Dive Projects</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {projects.length}
                </span>
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group"
                  >
                    <Card className="p-8 h-full bg-white dark:bg-white border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Project</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-500 text-base line-clamp-3 leading-relaxed mb-8">
                        {project.summary}
                      </p>
                      <div className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore Case Study <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Tutorials Gallery */}
          {tutorials.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Technical Guides</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {tutorials.length}
                </span>
              </div>
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {tutorials.map((tutorial) => (
                  <Link
                    key={tutorial.id}
                    href={`/tutorials/${tutorial.slug}`}
                    className="group"
                  >
                    <Card className="p-8 h-full bg-white dark:bg-white border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Tutorial</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                        {tutorial.title}
                      </h3>
                      <p className="text-slate-500 text-base line-clamp-3 leading-relaxed mb-8">
                        {tutorial.summary}
                      </p>
                      <div className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        Read Guide <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </Card>
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
