// auth.ts - CREATE THIS FILE
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyUserCredentials } from "@/lib/auth/user-service"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await verifyUserCredentials(
          credentials.email as string,
          credentials.password as string
        )
        
        if (!user) return null

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.name = user.name
        // token.firstName = user.firstName as string
        // token.lastName = user.lastName as string
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        // session.user.firstName = token.firstName as string
        // session.user.lastName = token.lastName as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    // signUp: "/signup",
  },
})