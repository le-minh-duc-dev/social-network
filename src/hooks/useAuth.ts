import { useSession } from "next-auth/react"

export const useAuth = () => {
  const session = useSession()
  return {
    authUser: session.data?.user,
    isAuthenticated: !!session.data?.user,
  }
}
