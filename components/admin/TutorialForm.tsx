'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { createTutorialAction, updateTutorialAction } from "@/lib/actions/tutorials"
import TiptapEditor from "@/components/admin/editor/TiptapEditor"
import Card from "@/components/ui/Card"
import { Upload, X, CheckCircle2, AlertCircle, Save, ArrowLeft } from "lucide-react"
import { slugify } from "@/utils/slugify"
import { toast } from "sonner"

interface Series {
  id: string
  title: string
}

interface TutorialFormProps {
  initialData?: any
  series: Series[]
  mode: 'new' | 'edit'
}

export default function TutorialForm({ initialData, series, mode }: TutorialFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.cover_image || null)
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      status: 'draft',
      tags: '',
    }
  })
  const [body, setBody] = useState(initialData?.body || "")
  const [isSlugManual, setIsSlugManual] = useState(false)
  const watchedTitle = watch('title')

  useEffect(() => {
    if (!isSlugManual && watchedTitle) {
      setValue('slug', slugify(watchedTitle), { shouldValidate: true })
    }
  }, [watchedTitle, isSlugManual, setValue])

  useEffect(() => {
    if (mode !== 'edit' || !initialData?.id) return

    const timer = setTimeout(async () => {
      setAutosaveStatus('saving')
      try {
        await updateTutorialAction(initialData.id, {
          ...getValues(),
          body: body
        })
        setAutosaveStatus('saved')
        setTimeout(() => setAutosaveStatus('idle'), 3000)
      } catch (error) {
        console.error('Autosave failed', error)
        setAutosaveStatus('idle')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [body, mode, initialData?.id, getValues])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.url) {
        setCoverImage(data.url)
        setValue('cover_image', data.url)
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('An error occurred during upload')
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const result = mode === 'new'
        ? await createTutorialAction({ ...data, body })
        : await updateTutorialAction(initialData.id, { ...data, body })

      if (result.success) {
        toast.success(mode === 'new' ? 'Tutorial published!' : 'Tutorial updated!')
        router.push('/admin/tutorials')
        router.refresh()
      } else {
        toast.error(result.error || 'An error occurred saving the tutorial')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
            <Link href="/admin/tutorials" className="hover:text-primary transition-colors">Tutorials</Link>
            <span>/</span>
            <span className="text-slate-900">{mode === 'new' ? 'Create New' : 'Edit Entry'}</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900">
            {mode === 'new' ? 'New Tutorial' : 'Edit Tutorial'}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-all hover:bg-slate-100 rounded-full"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Content Details</h3>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-semibold text-slate-700 ml-1">
                    Tutorial Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    {...register('title', { required: 'Title is required' })}
                    className="block w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-medium text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                    placeholder="Enter a compelling title..."
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.title.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-semibold text-slate-700 ml-1">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-medium pl-2">/tutorials/</span>
                    <input
                      type="text"
                      id="slug"
                      {...register('slug', {
                        required: 'Slug is required',
                        pattern: {
                          value: /^[a-z0-9-]+$/,
                          message: 'Slug must contain only lowercase letters, numbers, and hyphens'
                        }
                      })}
                      onChange={(e) => {
                        register('slug').onChange(e)
                        setIsSlugManual(true)
                      }}
                      className="block w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                      placeholder="tutorial-url-slug"
                    />
                  </div>
                  {errors.slug && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.slug.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="summary" className="text-sm font-semibold text-slate-700 ml-1">
                    Brief Summary
                  </label>
                  <textarea
                    id="summary"
                    rows={3}
                    {...register('summary', { required: 'Summary is required' })}
                    className="block w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-base text-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                    placeholder="What is the core value of this tutorial?"
                  />
                  {errors.summary && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.summary.message as string}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Technical Content</label>
                    <span className={`text-[10px] font-bold transition-colors ${
                      autosaveStatus === 'saving' ? 'text-primary' :
                      autosaveStatus === 'saved' ? 'text-green-600' : 'text-slate-400'
                    }`}>
                      {autosaveStatus === 'saving' ? 'Saving...' : autosaveStatus === 'saved' ? 'Changes saved' : 'Idle'}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <TiptapEditor
                      content={body}
                      onChange={(content) => setBody(content)}
                    />
                  </div>
                  {!body && <p className="text-xs text-red-500 mt-1 ml-1">Content is required</p>}
                </div>
              </div>
            </section>
          </div>

          {/* Side Settings Column */}
          <div className="space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Settings</h3>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-xs font-bold text-slate-500 uppercase">Status</label>
                    <select
                      id="status"
                      {...register('status')}
                      className="block w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="series_id" className="text-xs font-bold text-slate-500 uppercase">Learning Path</label>
                    <select
                      id="series_id"
                      {...register('series_id')}
                      className="block w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                    >
                      <option value="">Standalone</option>
                      {series.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="series_order" className="text-xs font-bold text-slate-500 uppercase">Position</label>
                    <input
                      type="number"
                      id="series_order"
                      {...register('series_order')}
                      className="block w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                      placeholder="1"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase block">Cover Image</label>
                <div className="relative group cursor-pointer">
                  <div className={`relative w-full h-40 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${coverImage ? 'border-primary bg-slate-50' : 'border-slate-200 bg-slate-50 hover:border-primary'}`}>
                    {coverImage ? (
                      <>
                        <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImage(null);
                              setValue('cover_//image', '');
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <Upload size={24} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-medium">Upload Cover</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
                {isUploading && (
                  <p className="text-[10px] text-primary animate-pulse text-center font-medium">Uploading asset...</p>
                )}
              </Card>

              <Card className="p-6 bg-white border-slate-200 shadow-sm space-y-4">
                <label htmlFor="tags" className="text-xs font-bold text-slate-500 uppercase block">Tags</label>
                <input
                  type="text"
                  id="tags"
                  {...register('tags')}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="Next.js, AWS, DevOps"
                />
                <p className="text-[10px] text-slate-400">Comma separated values</p>
              </Card>
            </section>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-12 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !body}
            className="px-8 py-2.5 bg-foreground text-background rounded-full text-sm font-bold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-md"
          >
            {isSubmitting ? 'Saving...' : mode === 'new' ? 'Publish Tutorial' : 'Update Tutorial'}
          </button>
        </div>
      </form>
    </div>
  )
}
