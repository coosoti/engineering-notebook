export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          About This Engineering Notebook
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Documenting my journey in technical exploration and problem-solving
        </p>
      </div>

      <div className="mt-16 prose prose-lg max-w-none">
        <p>
          This engineering notebook serves as a personal knowledge base and public documentation
          of my work in various technical domains including AI Engineering, System Design,
          DevOps, MLOps, and AIOps.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-12">Purpose</h2>
        <p>
          The primary purpose of this notebook is to:
        </p>
        <ul>
          <li>Document technical solutions and approaches for future reference</li>
          <li>Share knowledge and insights with the broader technical community</li>
          <li>Track personal growth and learning in various technology areas</li>
          <li>Create a portfolio of technical work and problem-solving approaches</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-12">Content Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-indigo-600">Projects</h3>
            <p className="mt-2 text-gray-600">
              In-depth case studies of technical projects, including architecture decisions,
              implementation details, and lessons learned.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-indigo-600">Tutorials</h3>
            <p className="mt-2 text-gray-600">
              Step-by-step guides for specific technical tasks or concepts, designed to help
              others learn and implement similar solutions.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-12">Technology Stack</h2>
        <p>
          This platform is built with modern web technologies:
        </p>
        <ul>
          <li>Next.js 15+ with App Router for the frontend and backend</li>
          <li>TypeScript for type safety</li>
          <li>PostgreSQL for data storage</li>
          <li>Prisma ORM for database operations</li>
          <li>Tailwind CSS for styling</li>
          <li>NextAuth.js for authentication</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-12">Feedback</h2>
        <p>
          I welcome feedback on any of the content here. If you have suggestions for improvements,
          notice errors, or have questions about the implementations discussed, please feel free
          to reach out through the contact information provided.
        </p>
      </div>
    </div>
  )
}