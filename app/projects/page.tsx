import { getProjects } from "@/lib/db/projects"
import Link from "next/link"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-zinc-400">
          Explore my technical projects and case studies in AI Engineering and System Design
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="tech-card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Project
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                  {project.status}
                </span>
              </div>
              
              <Link href={`/projects/${project.slug}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-3">
                  {project.summary}
                </p>
              </Link>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech_stack?.map((tech) => (
                  <span key={tech} className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 border border-slate-200 dark:border-zinc-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  {project.author?.name?.[0] || 'U'}
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-zinc-300">
                  {project.author?.name || 'Unknown'}
                </p>
              </div>
              <time className="text-xs text-slate-400 dark:text-zinc-500">
                {new Date(project.created_at).toLocaleDateString()}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}