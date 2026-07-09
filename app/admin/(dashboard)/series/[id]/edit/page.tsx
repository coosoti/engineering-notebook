'use client'

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { updateSeries, reorderTutorialsAction } from "@/lib/actions/series"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

export default function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tutorials, setTutorials] = useState<any[]>([])
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm()

  useEffect(() => {
    async function loadSeries() {
      try {
        const response = await fetch(`/api/series/${id}`)
        const data = await response.json()

        if (data.error) {
          alert(data.error)
          router.push('/admin/series')
          return
        }

        setValue('title', data.title)
        setValue('slug', data.slug)
        setValue('description', data.description)
        setValue('cover_image', data.cover_image)
        setValue('status', data.status)
        setTutorials(data.tutorials || [])
      } catch (error) {
        console.error('Error loading series:', error)
      }
    }
    loadSeries()
  }, [id, setValue])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const result = await updateSeries(id, data)

      if (result.success) {
        router.push('/admin/series')
        router.refresh()
      } else {
        alert(result.error || 'Failed to update series')
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred while updating the series')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(tutorials)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update local state immediately for a snappy UI
    setTutorials(items)

    try {
      const tutorialIds = items.map(t => t.id)
      const response = await reorderTutorialsAction(id, tutorialIds)
      if (!response.success) {
        alert(response.error || 'Failed to save new order')
        // Revert state on error
        const originalTutorials = [...tutorials]
        const [moved] = originalTutorials.splice(result.destination.index, 1)
        originalTutorials.splice(result.source.index, 0, moved)
        setTutorials(originalTutorials)
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred while reordering')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Series
          </h2>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Series Form */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Series Title
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="cover_image"
                  {...register('cover_image')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
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
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Series'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tutorials Management */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Series Tutorials</h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop to reorder the sequence.
            </p>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="tutorials">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {tutorials.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No tutorials assigned to this series.</p>
                    ) : (
                      tutorials
                        .sort((a, b) => (a.series_order ?? 0) - (b.series_order ?? 0))
                        .map((tutorial, index) => (
                          <Draggable key={tutorial.id} draggableId={tutorial.id} index={index}>
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex items-center justify-between p-2 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center overflow-hidden">
                                  <span className="shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full mr-3">
                                    {index + 1}
                                  </span>
                                  <span className="text-sm font-medium text-gray-700 truncate">
                                    {tutorial.title}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-400 ml-2">
                                  Order: {tutorial.series_order ?? 0}
                                </span>
                              </li>
                            )}
                          </Draggable>
                        ))
                    )}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  )
}
