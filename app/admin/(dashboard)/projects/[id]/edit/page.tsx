'use client'

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { updateProjectAction } from "@/lib/actions/projects"
import { ProjectInput } from "@/lib/types/projects"
import TiptapEditor from "@/components/admin/editor/TiptapEditor"

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [body, setBody] = useState("")
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm<ProjectInput>()
  
  // Unwrap the params Promise using React.use()
  const { id } = use(params)

  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${id}`)
        const data = await response.json()

        setValue('title', data.title)
        setValue('slug', data.slug)
        setValue('summary', data.summary)
        setValue('status', data.status)
        setBody(data.body)
      } catch (error) {
        console.error('Error loading project:', error)
      }
    }
    loadProject()
  }, [id, setValue])

  useEffect(() => {
    if (!body) return

    const timer = setTimeout(async () => {
      setAutosaveStatus('saving')
      try {
        await updateProjectAction(id, {
          ...getValues(),
          body: body
        })
        setAutosaveStatus('saved')
        setTimeout(() => setAutosaveStatus('idle'), 3000)
      } catch (e) {
        console.error('Autosave failed', e)
        setAutosaveStatus('idle')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [body, id, getValues])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const result = await updateProjectAction(id, {
        ...data,
        body: body
      })

      if (result.success) {
        router.push('/admin/projects')
        router.refresh()
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred while updating the project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Project
          </h2>
        </div>
      </div>

      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              {...register('slug', { required: 'Slug is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Summary
            </label>
            <textarea
              id="summary"
              rows={3}
              {...register('summary', { required: 'Summary is required' })}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-600">{errors.summary.message as string}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <span className={`text-xs font-medium ${autosaveStatus === 'saving' ? 'text-indigo-500' : autosaveStatus === 'saved' ? 'text-green-500' : 'text-gray-400'}`}>
                {autosaveStatus === 'saving' ? 'Saving draft...' : autosaveStatus === 'saved' ? 'Draft saved' : 'All changes saved'}
              </span>
            </div>
            <TiptapEditor
              content={body}
              onChange={(content) => setBody(content)}
            />
            {!body && <p className="mt-1 text-sm text-red-600">Content is required</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !body}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
