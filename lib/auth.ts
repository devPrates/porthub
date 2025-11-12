import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url ?? undefined,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        token.name = user.name
        token.email = user.email
        token.avatar_url = (user as any).avatar_url
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).avatar_url = token.avatar_url
      }
      return session
    },
  },
}

export const getSession = () => getServerSession(authOptions)
export async function getSessionSafe() {
  try {
    return await getServerSession(authOptions)
  } catch {
    return null
  }
}

export async function validateApiKey(apiKey: string) {
  if (!apiKey) return null
  const record = await prisma.apiKey.findUnique({ where: { key: apiKey }, include: { user: true } })
  if (!record || !record.is_active) return null
  return { userId: record.user_id }
}
