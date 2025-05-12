import { FilePreview } from "@/types/FilePreview"
import { createContext, useContext } from "react"

interface MutatePostContextType {
  files: FilePreview[]
  setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>
  deletedFiles: FilePreview[]
  setDeletedFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>
  captionRef: React.RefObject<string>
  handleSubmit: () => void
  isPending: boolean
}
export const MutatePostContext = createContext<
  MutatePostContextType | undefined
>(undefined)

export const useMutatePostContext = () => {
  const context = useContext(MutatePostContext)
  if (!context) {
    throw new Error(
      "useCreatePostContext must be used within a CreatePostProvider"
    )
  }
  return context
}
