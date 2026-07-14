'use client'

import React, { useState } from 'react'
import { X, Upload, Link as LinkIcon, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (url: string) => void
  initialUrl?: string
}

export default function ImageUploadModal({ isOpen, onClose, onUpload, initialUrl }: ImageUploadModalProps) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload')
  const [url, setUrl] = useState(initialUrl || '')
  const [isUploading, setIsUploading] = useState(false)

  if (!isOpen) return null

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        onUpload(data.url)
        toast.success('Image uploaded successfully')
        onClose()
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch (err) {
      toast.error('An error occurred during upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url) {
      onUpload(url)
      onClose()
    } else {
      toast.error('Please enter a valid URL')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === 'upload'
                ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300'
              }`}
            >
              <Upload size={14} /> Upload File
            </button>
            <button
              type="button"
              onClick={() => setTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === 'url'
                ? 'bg-white dark:bg-zinc-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300'
              }`}
            >
              <LinkIcon size={14} /> External URL
            </button>
          </div>

          {tab === 'upload' ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-8 transition-colors hover:border-primary/50 group cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-full text-slate-400 group-hover:text-primary transition-colors mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-400">PNG, JPG or GIF (max. 5MB)</p>
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">Uploading...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="block w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2"
              >
                <Check size={16} /> Insert Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
