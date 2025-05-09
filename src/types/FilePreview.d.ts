interface FilePreview {
  id: string
  file: File | null
  preview: string
  size: string
  type: "image" | "video"
}