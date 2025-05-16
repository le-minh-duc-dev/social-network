import { UserService } from "@/service/UserService"
import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import WelcomeEmailTemplate from "@/email/WelcomeEmailTemplate"
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
import { EmailService } from "@/service/EmailService"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    _id: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
      async profile(profile) {
        const userService = new UserService()
        const email = profile.email
        const fullName = profile.name
        const avatarUrl = profile.picture
        const user = await userService.findUserByEmail(email)

        if (!user) {
          await userService.createUser({
            email,
            fullName,
            avatarUrl,
          })
          EmailService.send(
            WelcomeEmailTemplate({ name: fullName }),
            [email],
            "Welcome To Social Network"
          )
        }
        console.log(user,profile);

        return {
          ...profile,
          _id: user?._id.toString(),
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      token._id = user?._id
      console.log(user,token);
      return token
    },
    async session({ session, token }) {
      session.user.id = token._id
      console.log("session", session, token);
      return session
    },
  },
})
