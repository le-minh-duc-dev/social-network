import React, { useCallback, useMemo, useRef, useState } from "react"
import { CreatePostContext } from "./CreatePostContext"
import CreateModal from "./CreateModal"
import { useMediaUpload } from "@/context/MediaUploadContext"
import { createPost } from "@/actions/post/createPost"
import { FilePreview } from "@/types/FilePreview"
import { MediaItemDTO } from "@/domain/zod/PostUploadSchema"

export default function Create({
  isOpen,
  onOpenChange,
  onClose,
}: Readonly<{
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose: () => void
}>) {
  const uploadService = useMediaUpload()
  const [files, setFiles] = useState<FilePreview[]>([])
  const captionRef = useRef<string>("")

  const handleSubmit = useCallback(async () => {
    const caption = captionRef.current
    if (files.length === 0 && caption.length === 0) {
      return
    }

    const { success, failed } = await uploadService.uploadFilePreviews(files)

    if (failed.length > 0) {
      // Handle failed uploads
      console.error("Failed to upload files:", failed)
    }

    const result = await createPost({
      caption,
      media: success.map<MediaItemDTO>((frv) => ({
        url: frv.preview,
        type: frv.type,
      })),
    })

    if (result.status !== 200) {
      // Handle error
      console.error("Failed to create post:", result.message)
    } else {
      // Handle success
      alert("Post created successfully:" + result.data)
      setFiles([])
      captionRef.current = ""
      onClose()
    }
  }, [captionRef, files, uploadService, onClose])

  const contextValue = useMemo(
    () => ({
      files,
      setFiles,
      captionRef,
      handleSubmit,
    }),
    [files, setFiles, captionRef, handleSubmit]
  )

  return (
    <CreatePostContext.Provider value={contextValue}>
      <CreateModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </CreatePostContext.Provider>
  )
}
