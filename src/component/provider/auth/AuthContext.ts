import { AuthUser } from "@/types/auth"
import { createContext, useContext } from "react"

export interface AuthContextType {
  authUser: AuthUser | undefined
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
