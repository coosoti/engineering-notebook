import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/client"
import bcrypt from "bcryptjs"
import { authConfig } from "@/lib/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET, // ✅ Add this line
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('SERVER: authorize called with email:', credentials?.email)
        
        // DEBUG BYPASS: Use this to test if the DB is the problem
        if (credentials?.email === 'admin@test.com' && credentials?.password === 'password123') {
          console.log('DEBUG: Mock login successful')
          return { id: 'test-id', name: 'Test Admin', email: 'admin@test.com', role: 'admin', mustChangePassword: false }
        }
        if (!credentials?.email || !credentials?.password) {
          console.log('SERVER: Missing credentials')
          return null
        }
        
        try {
          console.log('SERVER: Searching for user in DB...')
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          
          if (!user || !user.password_hash) {
            console.log('SERVER: User not found or has no password hash')
            return null
          }
          
          console.log('SERVER: Comparing passwords...')
          const isValid = await bcrypt.compare(credentials.password as string, user.password_hash)
          
          if (!isValid) {
            console.log('SERVER: Password mismatch')
            return null
          }
          
          console.log('SERVER: Auth successful for user:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            mustChangePassword: user.must_change_password
          }
        } catch (error) {
          console.error('SERVER: Authorize error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.mustChangePassword = (user as any).must_change_password
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.mustChangePassword = token.mustChangePassword as boolean
      }
      return session
    }
  }
})

export const { GET, POST } = handlers