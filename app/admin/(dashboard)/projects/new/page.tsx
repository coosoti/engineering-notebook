'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { createProjectAction } from "@/lib/actions/projects"
import { ProjectInput } from "@/lib/types/projects"
import TiptapEditor from "@/components/admin/editor/TiptapEditor"
import Card from "@/components/ui/Card"
import { slugify } from "@/utils/slugify"
import { toast } from "sonner"

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm()
  const [body, setBody] = useState("")
  const [isSlugManual, setIsSlugManual] = useState(false)
  const watchedTitle = watch('title')

  useEffect(() => {
    if (!isSlugManual && watchedTitle) {
      setValue('slug', slugify(watchedTitle), { shouldValidate: true })
    }
  }, [watchedTitle, isSlugManual, setValue])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const result = await createProjectAction({
        ...data,
        body: body
      })

      if (result.success) {
        toast.success('Project created successfully!')
        router.push('/admin/projects')
        router.refresh()
      } else {
        toast.error(result.error || 'An error occurred while creating the project')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while creating the project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Create Project
          </h2>
          <p className="text-muted-foreground mt-1">
            Document your technical case study and system design.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-foreground">
                Title
              </label>
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Title is required' })}
                className="block w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="e.g. Scaling a Real-time Chat App"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-semibold text-foreground">
                Slug (Optional)
              </label>
              <input
                type="text"
                id="slug"
                {...register('slug')}
                onChange={(e) => {
                  register('slug').onChange(e)
                  setIsSlugManual(true)
                }}
                className="block w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="auto-generated-from-title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="summary" className="text-sm font-semibold text-foreground">
              Summary
            </label>
            <textarea
              id="summary"
              rows={3}
              {...register('summary', { required: 'Summary is required' })}
              className="block w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              placeholder="A brief overview of the project goals and outcomes..."
            />
            {errors.summary && (
              <p className="text-xs text-red-500">{errors.summary.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Content
            </label>
            <div className="rounded-lg border border-border overflow-hidden bg-background">
              <TiptapEditor
                content={body}
                onChange={(content) => setBody(content)}
              />
            </div>
            {!body && <p className="text-xs text-red-500">Content is required</p>}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div className="flex items-center gap-4">
              <label htmlFor="status" className="text-sm font-semibold text-foreground">
                Status
              </label>
              <select
                id="status"
                {...register('status')}
                className="bg-background border border-border rounded-lg px-3 py-1 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !body}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
