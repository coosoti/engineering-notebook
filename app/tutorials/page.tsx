import { getTutorials } from "@/lib/db/tutorials"
import Link from "next/link"

export default async function TutorialsPage() {
  const tutorials = await getTutorials()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-5xl">
          Tutorials
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-zinc-400">
          Learn through step-by-step guides and deep-dives into modern engineering
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="tech-card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Tutorial
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                  {tutorial.status}
                </span>
              </div>
              
              <Link href={`/tutorials/${tutorial.slug}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-3">
                  {tutorial.summary}
                </p>
              </Link>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  {tutorial.author?.name?.[0] || 'U'}
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                  {tutorial.author?.name || 'Unknown'}
                </p>
              </div>
              <time className="text-xs text-slate-400 dark:text-zinc-500">
                {new Date(tutorial.created_at).toLocaleDateString()}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}