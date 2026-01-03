// lib/auth/authOptions.ts
export const runtime = "nodejs"

import Credentials from "next-auth/providers/credentials";
// import { auth } from "next-auth/core"; // not required but keeps types
import { verifyUserCredentials } from "@/lib/auth/user-service";
// import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "../prisma";

export const authOptions = {
    // adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        if (!credentials) return null;
        const user = await verifyUserCredentials(credentials.email, credentials.password);
        // verifyUserCredentials returns sanitized user or null
        if (!user) return null;
        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  // Optional, but recommended:
  pages: {
    signIn: "/login",
     error: '/login',
  },

  // Add other NextAuth settings you need (callbacks, secret, etc.)
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? "customer";
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  // export as plain object; NextAuth will read the secret from env but you can set it here:
//   secret: process.env.NEXTAUTH_SECRET,
} as const;
