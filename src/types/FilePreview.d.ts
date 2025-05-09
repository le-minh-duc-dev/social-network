interface FilePreview {
  id: string
  file: File
  preview: string
  size: string
  type: "image" | "video"
}