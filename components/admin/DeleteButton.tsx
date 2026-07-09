'use client'

import { useState } from 'react'

interface DeleteButtonProps {
  id: string
  action: (id: string) => Promise<{ success: boolean }>
  label: string
  onSuccess?: () => void
}

export default function DeleteButton({ id, action, label, onSuccess }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${label}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await action(id)
      if (result.success) {
        if (onSuccess) {
          onSuccess()
        } else {
          // Fallback: refresh the page
          window.location.reload()
        }
      } else {
        alert('Failed to delete the item')
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred while deleting')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
