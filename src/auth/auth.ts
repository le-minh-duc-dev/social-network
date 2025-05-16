import { UserService } from "@/service/UserService"
import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

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
        const avatarUrl = profile.picture
        let user = await userService.findUserByEmail(email)

        user ??= await userService.createUser({
          email,
          fullName,
          avatarUrl,
        })


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
