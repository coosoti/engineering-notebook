'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createUserAction, updateUserRoleAction, deleteUserAction } from "@/lib/actions/users"
import Card from "@/components/ui/Card"
import { Plus, UserPlus, ShieldCheck, Trash2, Loader2, X } from "lucide-react"
import { toast } from "sonner"

type Role = 'ADMIN' | 'EDITOR' | 'AUTHOR'

// This is a client component, so we'll fetch users via a small API call or pass them as props.
// For the sake of the dashboard, we'll implement a simple fetcher.
async function fetchUsers() {
  const res = await fetch('/api/admin/users')
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      role: formData.get('role') as Role,
    }

    setIsCreating(true)
    try {
      const result = await createUserAction(data)
      if (result.success) {
        if (result.emailSent) {
          toast.success(`User ${data.email} created! A temporary password has been sent to their email.`)
        } else {
          toast.error(`User created, but we couldn't send the email. Please check your logs.`)
        }
        setIsModalOpen(false)
        await loadUsers()
      } else {
        toast.error(result.error)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  async function handleRoleChange(id: string, role: Role) {
    const previousUsers = [...users]

    // Optimistic Update: Change role immediately in the UI
    setUsers(users.map(u => u.id === id ? { ...u, role } : u))
    setIsUpdating(id)

    try {
      const result = await updateUserRoleAction(id, role)
      if (!result.success) {
        throw new Error(result.error)
      }
      toast.success('Role updated successfully')
    } catch (error: any) {
      // Rollback on error
      setUsers(previousUsers)
      toast.error(error.message || 'Failed to update role')
    } finally {
      setIsUpdating(null)
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const result = await deleteUserAction(id)
      if (result.success) {
        toast.success('User deleted')
        await loadUsers()
      } else {
        toast.error(result.error)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h2>
          <p className="text-muted-foreground mt-1">Manage system access and roles for your contributors.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200 hover:shadow-indigo-300"
        >
          <UserPlus size={18} />
          Create User
        </button>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Role</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{user.name || 'Unnamed User'}</div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    className={`text-xs font-bold px-2 py-1 rounded-full border transition-all outline-none ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                      user.role === 'EDITOR' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                    <option value="AUTHOR">Author</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.role === 'ADMIN'}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-30"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 transform-gpu antialiased">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create New User</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Initial Role</label>
                <select
                  name="role"
                  className="block w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="AUTHOR">Author</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus size={18} />}
                {isCreating ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
