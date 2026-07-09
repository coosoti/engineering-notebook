export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Engineering Notebook
        </h1>
        <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
          Documenting my journey in AI Engineering, System Design, DevOps, MLOps, and AIOps.
        </p>
      </div>

      <div className="mt-16 text-center">
        <p className="text-lg text-gray-600">
          This is a personal technical notebook and blog platform built with Next.js, TypeScript, and Tailwind CSS.
        </p>
        <div className="mt-8">
          <a
            href="/admin"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Access Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}