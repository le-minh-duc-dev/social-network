import { Permission } from "@/domain/enums/Permission"
import { Role } from "@/domain/enums/Role"
import { PermissionService } from "@/service/PermissionService"
import { UserService } from "@/service/UserService"
import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import WelcomeEmailTemplate from "@/email/WelcomeEmailTemplate"
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isActive: boolean
      role: Role
      avatarUrl?: string
      permissions: Partial<Record<Permission, boolean>>
    } & DefaultSession["user"]
  }
}

import {} from "next-auth/jwt"
import { EmailService } from "@/service/EmailService"

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string
    isActive: boolean
    role: Role
    avatarUrl?: string
    permissions: Partial<Record<Permission, boolean>>
    access_token: string
    expires_at: number
    refresh_token?: string
    error?: "RefreshTokenError"
  }
}

const JWT_EXPIRATION_DURATION = 15 * 60 //SECONDS

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

        return {
          ...profile,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // On first sign-in
      if (
        (!token.id && !token.role && !token.avatarUrl) ||
        Date.now() > token.expires_at * 1000
      ) {
        console.log("FETCH USER DATA FOR JWT-----------------")
        const userService = new UserService()
        const user = await userService.findUserByEmail(token.email!)

        if (!user) throw new Error("User not found")

        const permissions = PermissionService.getPermissions(user.role)

        token.id = user._id.toString()
        token.role = user.role
        token.permissions = permissions
        token.isActive = user.isActive
        token.avatarUrl = user.avatarUrl
      }

      if (account) {
        console.log("account called")
        token.access_token = account.access_token!
        token.expires_at = Math.floor(
          Date.now() / 1000 + JWT_EXPIRATION_DURATION
        )
        token.refresh_token = account.refresh_token
      }

      // Token still valid
      if (Date.now() < token.expires_at * 1000) {
        return token
      }

      // Token expired — refresh it
      try {
        if (!token.refresh_token) throw new Error("No refresh_token available")
        console.log("FETCH NEW TOKEN")
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.AUTH_GOOGLE_ID!,
            client_secret: process.env.AUTH_GOOGLE_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refresh_token,
          }),
        })

        const refreshedTokens = await response.json()

        if (!response.ok) {
          console.error("Refresh failed", refreshedTokens)
          throw new Error("Token refresh failed")
        }

        token.access_token = refreshedTokens.access_token
        token.expires_at = Math.floor(
          Date.now() / 1000 + JWT_EXPIRATION_DURATION
        )
        token.refresh_token =
          refreshedTokens.refresh_token ?? token.refresh_token

        return token
      } catch (error) {
        console.error("Error refreshing token", error)
        token.error = "RefreshTokenError"
        return token
      }
    },
    async session({ session, token }) {
      console.log("session called ")
      session.user.id = token.id
      session.user.role = token.role
      session.user.permissions = token.permissions
      session.user.isActive = token.isActive
      session.user.avatarUrl = token.avatarUrl
      return session
    },
  },
})
