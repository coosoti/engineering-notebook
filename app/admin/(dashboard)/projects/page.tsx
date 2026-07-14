import { getProjects } from "@/lib/db/projects"
import { deleteProjectAction } from "@/lib/actions/projects"
import Link from "next/link"
import DeleteButton from "@/components/admin/DeleteButton"
import Card from "@/components/ui/Card"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Projects
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your technical case studies and deep-dives.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center px-4 py-2 rounded-lg shadow-sm text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-all active:scale-95"
        >
          New Project
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="divide-y divide-border">
          {projects.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No projects found. Start by creating your first one!</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="group px-6 py-5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-base font-semibold text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {project.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                      {project.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      project.status === 'published'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {project.status}
                    </span>
                    <DeleteButton
                      id={project.id}
                      action={deleteProjectAction}
                      label="project"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    {project.github_url && (
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-border" />
                        GitHub linked
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="text-primary font-medium hover:underline"
                  >
                    Edit details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
