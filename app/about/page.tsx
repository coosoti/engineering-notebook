import TableOfContents from "@/components/TableOfContents"
import { extractHeadings, injectHeadingIds } from "@/lib/utils/toc"
import { sanitizeHtml } from "@/lib/security"

export default function AboutPage() {
  // The content is static here, so we define it as a string to allow ToC parsing
  const contentHtml = `
    <h2 class="text-2xl font-bold text-slate-900 mt-12">Purpose</h2>
    <p>
      The primary purpose of this notebook is to:
    </p>
    <ul>
      <li>Document technical solutions and approaches for future reference</li>
      <li>Share knowledge and insights with the broader technical community</li>
      <li>Track personal growth and learning in various technology areas</li>
      <li>Create a portfolio of technical work and problem-solving approaches</li>
    </ul>

    <h2 class="text-2xl font-bold text-slate-900 mt-12">Content Types</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h3 class="text-xl font-semibold text-primary">Projects</h3>
        <p class="mt-2 text-slate-500">
          In-depth case studies of technical projects, including architecture decisions,
          implementation details, and lessons learned.
        </p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h3 class="text-xl font-semibold text-primary">Tutorials</h3>
        <p class="mt-2 text-slate-500">
          Step-by-step guides for specific technical tasks or concepts, designed to help
          others learn and implement similar solutions.
        </p>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-slate-900 mt-12">Technology Stack</h2>
    <p>
      This platform is built with modern web technologies:
    </p>
    <ul class="list-disc pl-5 space-y-2 mt-4 text-slate-600">
      <li>Next.js 15+ with App Router for the frontend and backend</li>
      <li>TypeScript for type safety</li>
      <li>PostgreSQL for data storage</li>
      <li>Prisma ORM for database operations</li>
      <li>Tailwind CSS for styling</li>
      <li>NextAuth.js for authentication</li>
    </ul>

    <h2 class="text-2xl font-bold text-slate-900 mt-12">Feedback</h2>
    <p>
      I welcome feedback on any of the content here. If you have suggestions for improvements,
      notice errors, or have questions about the implementations discussed, please feel free
      to reach out through the contact information provided.
    </p>
  `

  const headings = extractHeadings(contentHtml)
  const bodyWithIds = injectHeadingIds(contentHtml)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          <div className="flex-1 max-w-4xl">
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight">
                About This Engineering Notebook
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 font-light">
                Documenting my journey in technical exploration and problem-solving
              </p>
            </header>

            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-500 mb-12 leading-relaxed font-light">
                This engineering notebook serves as a personal knowledge base and public documentation
                of my work in various technical domains including AI Engineering, System Design,
                DevOps, MLOps, and AIOps.
              </p>

              <div
                className="mt-6 text-slate-800"
                dangerouslySetInnerHTML={{ __html: bodyWithIds }}
              />
            </div>
          </div>

          {headings.length > 0 && (
            <div className="hidden xl:block w-64 shrink-0">
              <TableOfContents headings={headings} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
