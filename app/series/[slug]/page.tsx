import { prisma } from "@/lib/db/client"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Metadata } from "next"
import { generateSEOConfig } from "@/utils/seo"
import JsonLd from "@/components/seo/JsonLd"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const series = await prisma.series.findUnique({
    where: { slug },
  })

  if (!series) {
    return { title: 'Series Not Found' }
  }

  return generateSEOConfig({
    title: series.title,
    description: series.description || 'A technical series of tutorials.',
    url: `https://yourdomain.com/series/${series.slug}`,
  })
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const series = await prisma.series.findUnique({
    where: { slug },
    include: {
      tutorials: {
        orderBy: { series_order: 'asc' },
      },
    },
  })

  if (!series) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": series.title,
    "description": series.description,
    "provider": {
      "@type": "Organization",
      "name": "Engineering Notebook",
      "sameAs": "https://yourdomain.com"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseCode": series.slug,
      "courseLanguage": "en"
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <JsonLd data={jsonLd} />
      
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {series.title}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          {series.description}
        </p>
      </header>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Curriculum</h2>
        {series.tutorials.map((tutorial, index) => (
          <Link
            key={tutorial.id}
            href={`/tutorials/${tutorial.slug}`}
            className="group block p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {tutorial.title}
                </h3>
              </div>
              <span className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
