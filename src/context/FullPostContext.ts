import { Post } from "@/types/schema"
import { createContext, useContext } from "react"

interface FullPostContextType {
  setPost: React.Dispatch<React.SetStateAction<Post | null>>
}

export const FullPostContext = createContext<FullPostContextType | null>(null)

export const useFullPostModal = () => {
  const context = useContext(FullPostContext)
  if (!context) throw new Error("FullPostContext not provided")
  return context
}
