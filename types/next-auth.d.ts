import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth"

declare module "next-auth" {
  /**
   * Extended session object to include user ID and role
   */
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  /**
   * Extended user object to include role from the database
   */
  interface User extends NextAuthUser {
    role: string
  }

  /**
   * Extended AdapterUser to include role for Prisma adapter compatibility
   */
  interface AdapterUser {
    role: string
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT token to include user ID and role
   */
  interface JWT {
    id: string
    role: string
  }
}
