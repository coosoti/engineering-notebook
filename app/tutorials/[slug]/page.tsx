import { getTutorialBySlug } from "@/lib/db/tutorials"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { generateSEOConfig } from "@/utils/seo"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tutorial = await getTutorialBySlug(slug)

  if (!tutorial) {
    return {
      title: 'Tutorial Not Found',
    }
  }

  return generateSEOConfig({
    title: tutorial.seo_title || tutorial.title,
    description: tutorial.seo_description || tutorial.summary,
    url: `https://yourdomain.com/tutorials/${tutorial.slug}`,
    image: tutorial.og_image ?? undefined,
  })
}

export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tutorial = await getTutorialBySlug(slug) as any

  if (!tutorial) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {tutorial.title}
          </h1>
          <div className="mt-4 flex items-center">
            <div className="shrink-0">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {tutorial.status}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {tutorial.author?.name || tutorial.author?.email}
              </p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={tutorial.created_at.toString()}>
                  {new Date(tutorial.created_at).toLocaleDateString()}
                </time>
                {tutorial.updated_at && (
                  <>
                    <span aria-hidden="true">&middot;</span>
                    <time dateTime={tutorial.updated_at.toString()}>
                      Updated {new Date(tutorial.updated_at).toLocaleDateString()}
                    </time>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            {tutorial.summary}
          </p>

          <div className="mt-6 text-gray-700 whitespace-pre-line">
            {tutorial.body}
          </div>
        </div>

        {tutorial.series && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-800">
              Part of the series: <Link href={`/series/${tutorial.series.slug}`} className="underline hover:text-blue-600">{tutorial.series.title}</Link>
            </p>
          </div>
        )}

        {tutorial.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-900">Tags</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {tutorial.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
