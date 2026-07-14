import { getProjects } from "@/lib/db/projects"
import Link from "next/link"
import Card from "@/components/ui/Card"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-[#f2f2f0] text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-96 h-96 bg-slate-100 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 sm:text-6xl mb-6">
            Projects
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 leading-relaxed">
            Explore my technical projects and case studies in AI Engineering and System Design.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group"
            >
              <Card className="p-8 h-full bg-white dark:bg-white border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Project</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                    {project.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-base line-clamp-3 leading-relaxed mb-8">
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech_stack?.map((tech) => (
                    <span key={tech} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {project.author?.name?.[0] || 'A'}
                    </div>
                    <span className="text-xs text-slate-500">{project.author?.name || 'Admin User'}</span>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Case Study <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
