import { getTutorialBySlug, getAdjacentTutorials } from "@/lib/db/tutorials"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { generateSEOConfig } from "@/utils/seo"
import { highlightHtml } from "@/lib/utils/highlight"
import { generateTutorialSchema } from "@/lib/utils/seo-schema"
import JsonLd from "@/components/seo/JsonLd"
import SeriesSidebar from "@/components/series/SeriesSidebar"
import TableOfContents from "@/components/TableOfContents"
import { extractHeadings, injectHeadingIds } from "@/lib/utils/toc"
import { prisma } from "@/lib/db/client"
import { Tutorial } from "@prisma/client"
import { sanitizeHtml } from "@/lib/security"
import ReadingProgressBar from "@/components/ReadingProgressBar"

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
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://engineering-notebook.vercel.app"}/tutorials/${tutorial.slug}`,
    image: tutorial.og_image ?? undefined,
  })
}

export default async function TutorialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tutorial = await getTutorialBySlug(slug) as any

  if (!tutorial) {
    notFound()
  }

  const rawBody = tutorial.body
  const headings = extractHeadings(rawBody)
  const bodyWithIds = injectHeadingIds(rawBody)
  const highlightedBody = await highlightHtml(bodyWithIds)
  const jsonLd = generateTutorialSchema(tutorial)

  let navigation = null
  let seriesTutorials: Tutorial[] = []
  let seriesTitle = ""

  if (tutorial.series_id) {
    navigation = await getAdjacentTutorials(tutorial.series_id, tutorial.series_order || 0)
    const series = await prisma.series.findUnique({
      where: { id: tutorial.series_id },
      include: { tutorials: { orderBy: { series_order: 'asc' } } }
    })
    if (series) {
      seriesTutorials = series.tutorials
      seriesTitle = series.title
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgressBar />
      <JsonLd data={jsonLd} />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          {tutorial.series_id && (
            <div className="hidden lg:block w-64 shrink-0">
              <SeriesSidebar
                seriesTitle={seriesTitle}
                tutorials={seriesTutorials}
                currentTutorialSlug={slug}
              />
            </div>
          )}

          <div className="flex-1 max-w-4xl">
            <article>
              <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
                  {tutorial.title}
                </h1>
                <div className="mt-6 flex items-center gap-4">
                  <div className="shrink-0">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                      {tutorial.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {tutorial.author?.name || tutorial.author?.email}
                    </p>
                    <span className="text-slate-300">•</span>
                    <div className="flex space-x-1 text-sm text-slate-500">
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

              <div className="flex gap-12">
                <div className="prose prose-lg max-w-none flex-1">
                  <p className="text-xl text-slate-500 mb-12 leading-relaxed font-light">
                    {tutorial.summary}
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

              {tutorial.series && (
                <div className="mt-20 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 mb-6">
                    Part of the series: <Link href={`/series/${tutorial.series.slug}`} className="text-primary underline hover:opacity-80 font-bold">{tutorial.series.title}</Link>
                  </p>
                  <div className="flex justify-between items-center">
                    {navigation?.prev ? (
                      <Link
                        href={`/tutorials/${navigation.prev.slug}`}
                        className="inline-flex items-center px-5 py-2.5 border border-slate-200 text-sm font-medium rounded-full bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                      >
                        ← Previous: {navigation.prev.title}
                      </Link>
                    ) : (
                      <div />
                    )}
                    {navigation?.next ? (
                      <Link
                        href={`/tutorials/${navigation.next.slug}`}
                        className="inline-flex items-center px-5 py-2.5 border border-slate-200 text-sm font-medium rounded-full bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                      >
                        Next: {navigation.next.title} →
                      </Link>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              )}

              {tutorial.tags.length > 0 && (
                <div className="mt-20 pt-12 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Related Topics</h3>
                  <div className="flex flex-wrap gap-3">
                    {tutorial.tags.map((tag: string) => (
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
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
