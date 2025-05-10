// MediaUploadContext.tsx
import { IMediaUploadService } from "@/types/media_service"
import { createContext, useContext } from "react"

export const MediaUploadContext = createContext<IMediaUploadService | null>(
  null
)

export const useMediaUpload = () => {
  const context = useContext(MediaUploadContext)
  if (!context) throw new Error("MediaUploadContext not provided")
  return context
}
