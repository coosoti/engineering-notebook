import { prisma } from "@/lib/db/client"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { generateSEOConfig } from "@/utils/seo"
import { highlightHtml } from "@/lib/utils/highlight"
import { generateTutorialSchema } from "@/lib/utils/seo-schema"
import JsonLd from "@/components/seo/JsonLd"
import SeriesSidebar from "@/components/series/SeriesSidebar"
import TableOfContents from "@/components/TableOfContents"
import { extractHeadings, injectHeadingIds } from "@/lib/utils/toc"
import { sanitizeHtml } from "@/lib/security"
import ReadingProgressBar from "@/components/ReadingProgressBar"

export async function generateMetadata({ params }: { params: Promise<{ slug: string; "chapter-slug": string }> }): Promise<Metadata> {
  const { slug, "chapter-slug": chapterSlug } = await params
  const series = await prisma.series.findUnique({
    where: { slug },
    include: {
      tutorials: {
        where: { slug: chapterSlug, status: "published" },
        include: { author: true }
      }
    }
  })

  if (!series || series.tutorials.length === 0) {
    return { title: 'Chapter Not Found' }
  }

  const tutorial = series.tutorials[0]
  return generateSEOConfig({
    title: tutorial.seo_title || tutorial.title,
    description: tutorial.seo_description || tutorial.summary,
    url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://engineering-notebook.vercel.app"}/series/${series.slug}/${tutorial.slug}`,
    image: tutorial.og_image ?? undefined,
  })
}

export default async function SeriesChapterPage({ params }: { params: Promise<{ slug: string; "chapter-slug": string }> }) {
  const { slug, "chapter-slug": chapterSlug } = await params

  const series = await prisma.series.findUnique({
    where: { slug, status: "published" },
    include: {
      tutorials: {
        where: { status: "published" },
        orderBy: { series_order: "asc" },
        include: { author: true }
      }
    }
  })

  if (!series) {
    notFound()
  }

  const tutorial = series.tutorials.find(t => t.slug === chapterSlug)
  if (!tutorial) {
    notFound()
  }

  const currentOrder = tutorial.series_order ?? 0
  const navigation = {
    prev: series.tutorials.find(t => (t.series_order ?? 0) < currentOrder),
    next: series.tutorials.find(t => (t.series_order ?? 0) > currentOrder),
  }

  const rawBody = tutorial.body
  const headings = extractHeadings(rawBody)
  const bodyWithIds = injectHeadingIds(rawBody)
  const highlightedBody = await highlightHtml(bodyWithIds)
  const jsonLd = generateTutorialSchema(tutorial)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ReadingProgressBar />
      <JsonLd data={jsonLd} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          <div className="hidden lg:block w-64 shrink-0">
            <SeriesSidebar
              seriesTitle={series.title}
              tutorials={series.tutorials}
              currentTutorialSlug={chapterSlug}
            />
          </div>

          <div className="flex-1 max-w-4xl">
            <article>
              <header className="mb-12">
                <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
                  <ol className="flex items-center gap-2">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li aria-hidden="true">/</li>
                    <li><a href="/series" className="hover:underline">Series</a></li>
                    <li aria-hidden="true">/</li>
                    <li><a href={`/series/${series.slug}`} className="hover:underline">{series.title}</a></li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="font-medium text-slate-900">{tutorial.title}</li>
                  </ol>
                </nav>
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
                  {tutorial.title}
                </h1>
                <div className="mt-6 flex items-center gap-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    {tutorial.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      {tutorial.author?.name || tutorial.author?.email}
                    </p>
                    <span className="text-slate-300">•</span>
                    <time dateTime={tutorial.created_at.toISOString()}>
                      {new Date(tutorial.created_at).toLocaleDateString()}
                    </time>
                    {tutorial.updated_at && (
                      <>
                        <span aria-hidden="true">·</span>
                        <time dateTime={tutorial.updated_at.toISOString()}>
                          Updated {new Date(tutorial.updated_at).toLocaleDateString()}
                        </time>
                      </>
                    )}
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

              <div className="mt-20 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-sm font-semibold text-slate-900 mb-6">
                  Part of the series: <a href={`/series/${series.slug}`} className="text-primary underline hover:opacity-80 font-bold">{series.title}</a>
                </p>
                <div className="flex justify-between items-center">
                  {navigation.prev ? (
                    <a
                      href={`/series/${series.slug}/${navigation.prev.slug}`}
                      className="inline-flex items-center px-5 py-2.5 border border-slate-200 text-sm font-medium rounded-full bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      ← Previous: {navigation.prev.title}
                    </a>
                  ) : (
                    <div />
                  )}
                  {navigation.next ? (
                    <a
                      href={`/series/${series.slug}/${navigation.next.slug}`}
                      className="inline-flex items-center px-5 py-2.5 border border-slate-200 text-sm font-medium rounded-full bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      Next: {navigation.next.title} →
                    </a>
                  ) : (
                    <div />
                  )}
                </div>
              </div>

              {tutorial.tags.length > 0 && (
                <div className="mt-20 pt-12 border-t border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Related Topics</h3>
                  <div className="flex flex-wrap gap-3">
                    {tutorial.tags.map((tag: string) => (
                      <a
                        key={tag}
                        href={`/tags/${tag}`}
                        className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        #{tag}
                      </a>
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
