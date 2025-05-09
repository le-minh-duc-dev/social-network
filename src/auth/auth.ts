import { Permission } from "@/domain/enums/Permission"
import { Role } from "@/domain/enums/Role"
import { PermissionService } from "@/service/PermissionService"
import { UserService } from "@/service/UserService"
import NextAuth, { DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"

declare module "next-auth" {
  interface User {
    id: string
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
          id: user._id.toString(),
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
        token.id = user.id
        token.role = user.role
        token.permissions = user.permissions
        token.isActive = user.isActive
        token.avatarUrl = user.avatarUrl
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as Role
      session.user.permissions = token.permissions as Partial<
        Record<Permission, boolean>
      >
      session.user.isActive = token.isActive as boolean
      session.user.avatarUrl = token.avatarUrl as string
      return session
    },
  },
})
