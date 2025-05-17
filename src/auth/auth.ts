import { UserService } from "@/service/UserService"
import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
declare module "next-auth" {
  interface User {
    _id: string
  }

  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

import {} from "next-auth/jwt"
import { LoginSchema } from "@/domain/zod/LoginSchema"
import { PasswordEncoder } from "@/lib/PasswordEncoder"
import { Formater } from "@/lib/Formater"
import { AuthHelper } from "@/lib/AuthHelper"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      async profile(profile) {
        const userService = new UserService()
        const email = profile.email
        const fullName = profile.name
        const normalizedFullName = Formater.normalizeVietnamese(fullName)
        const username = AuthHelper.generateUsername(normalizedFullName)
        const avatarUrl = profile.picture
        let user = await userService.findUserByEmail(email)

        user ??= await userService.createUser({
          email,
          fullName,
          normalizedFullName,
          avatarUrl,
          username,
        })

        return {
          _id: user._id.toString(),
        }
      },
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const safeFormData = LoginSchema.safeParse(credentials)
        if (!safeFormData.success) {
          throw new Error("Invalid credentials.")
        }
        const { email, password } = safeFormData.data
        const userService = new UserService()

        const user = await userService.findUserByEmail(email)
        if (!user) {
          throw new Error("Invalid credentials.")
        }

        const isValidPassword = await PasswordEncoder.comparePassword(
          password,
          user.password!
        )
        if (!isValidPassword) {
          throw new Error("Invalid credentials.")
        }

        return {
          _id: user._id.toString(),
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("User in jwt callback (login):", user)
        token.id = user._id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
})
