import { createContext, useContext } from "react"

interface CreatePostContextType {
  files: FilePreview[]
  setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>
}
export const CreatePostContext = createContext<CreatePostContextType>({
  files: [],
  setFiles: () => {},
})

export const useCreatePostContext = () => {
  const context = useContext(CreatePostContext)
  if (!context) {
    throw new Error(
      "useCreatePostContext must be used within a CreatePostProvider"
    )
  }
  return context
}
