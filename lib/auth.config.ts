import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = request.nextUrl.pathname.startsWith('/admin')

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
} satisfies NextAuthConfig
