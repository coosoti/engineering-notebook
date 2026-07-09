import { getTutorials } from "@/lib/db/tutorials"
import { deleteTutorialAction } from "@/lib/actions/tutorials"
import Link from "next/link"
import DeleteButton from "@/components/admin/DeleteButton"

export default async function TutorialsPage() {
  const tutorials = await getTutorials()

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Tutorials
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/tutorials/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Tutorial
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tutorials.map((tutorial) => (
            <li key={tutorial.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <Link href={`/admin/tutorials/${tutorial.id}/edit`} className="text-sm font-medium text-indigo-600 truncate">
                    {tutorial.title}
                  </Link>
                  <div className="ml-2 flex-shrink-0 flex items-center">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {tutorial.status}
                    </p>
                    <DeleteButton
                      id={tutorial.id}
                      action={deleteTutorialAction}
                      label="tutorial"
                    />
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {tutorial.summary}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Created on {new Date(tutorial.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
