import { createContext, useContext } from "react"

interface CreatePostContextType {
  files: FilePreview[]
  setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>
  captionRef: React.RefObject<string>
}
export const CreatePostContext = createContext<CreatePostContextType | undefined>(undefined)

export const useCreatePostContext = () => {
  const context = useContext(CreatePostContext)
  if (!context) {
    throw new Error(
      "useCreatePostContext must be used within a CreatePostProvider"
    )
  }
  return context
}
