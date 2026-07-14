import { Role } from '@prisma/client'

export type UserWithRole = {
  role: Role
  id: string
}

export const Permissions = {
  canManageUsers: (user: UserWithRole) => {
    return String(user.role).toUpperCase() === 'ADMIN'
  },

  canPublish: (user: UserWithRole) => {
    const role = String(user.role).toUpperCase()
    return role === 'ADMIN' || role === 'EDITOR'
  },

  canEditAny: (user: UserWithRole) => {
    const role = String(user.role).toUpperCase()
    return role === 'ADMIN' || role === 'EDITOR'
  },

  canEditOwn: (user: UserWithRole, ownerId: string) => {
    const role = String(user.role).toUpperCase()
    if (role === 'ADMIN' || role === 'EDITOR') return true
    return user.id === ownerId
  },

  canCreateContent: (user: UserWithRole) => {
    // Everyone with a role can create drafts
    return ['ADMIN', 'EDITOR', 'AUTHOR'].includes(String(user.role).toUpperCase())
  }
}
