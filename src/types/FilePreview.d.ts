import { MediaType } from "@/domain/enums/MediaType"

export interface FilePreview {
  id: string
  file: File | null
  preview: string
  size: string
  type: MediaType
}