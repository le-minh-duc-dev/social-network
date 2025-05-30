"use client"

import { useMemo } from "react"
import { AuthContext, AuthContextType } from "./AuthContext"
import { useQuery } from "@tanstack/react-query"
import { AuthAPI } from "@/service/api/AuthAPI"
import { useSession } from "next-auth/react"
import { QueryKey } from "@/domain/enums/QueryKey"

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession()
  const userId = session?.data?.user?.id
  const { data: authUser, isLoading } = useQuery({
    queryFn: async () => {
      return await AuthAPI.getAuthUser(userId!)
    },
    queryKey: [QueryKey.GET_USERS, "AUTH", userId],

    enabled: !!userId,

    refetchInterval: 1000 * 60 * 3, // 3 minutes
  })

  const contextValue = useMemo<AuthContextType>(
    () => ({
      authUser,
      isAuthenticated: !!authUser,
      isLoading,
    }),
    [authUser, isLoading]
  )
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
export default AuthProvider
