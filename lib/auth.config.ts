// lib/auth.config.ts
import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request }: { auth: any; request: any }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = request.nextUrl.pathname.startsWith('/admin')

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
}