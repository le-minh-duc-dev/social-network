import { Permission } from "@/domain/enums/Permission"
import { Role } from "@/domain/enums/Role"
import { PermissionService } from "@/service/PermissionService"
import { UserService } from "@/service/UserService"
import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

declare module "next-auth" {
  interface User {
    _id: string
    email: string
    name: string
    avatarUrl?: string
    role: Role
    permissions: Partial<Record<Permission, boolean>>
    isActive: boolean
  }

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

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string
    isActive: boolean
    role: Role
    avatarUrl?: string
    permissions: Partial<Record<Permission, boolean>>
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      async profile(profile) {
        const email = profile.email
        const fullName = profile.name
        const avatarUrl = profile.picture
        let user = await UserService.findUserByEmail(email)

        user ??= await UserService.createUser({
          email,
          fullName,
          avatarUrl,
        })

        const permissions = PermissionService.getPermissions(user.role)

        return {
          _id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          avatarUrl: user.avatarUrl,
          role: user.role,
          permissions,
          isActive: user.isActive,
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
        token.role = user.role
        token.permissions = user.permissions
        token.isActive = user.isActive
        token.avatarUrl = user.avatarUrl
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      session.user.permissions = token.permissions
      session.user.isActive = token.isActive
      session.user.avatarUrl = token.avatarUrl
      return session
    },
  },
})
