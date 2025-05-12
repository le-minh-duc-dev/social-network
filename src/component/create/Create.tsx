import React, { useMemo, useRef, useState } from "react"
import MutatePostModal from "./MutatePostModal"
import { useMediaUpload } from "@/context/MediaUploadContext"
import { createPost } from "@/actions/post/createPost"
import { FilePreview } from "@/types/FilePreview"
import { MediaItemDTO } from "@/domain/zod/PostUploadSchema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKey } from "@/domain/enums/QueryKey"
import { MutatePostContext } from "./MutatePostContext"

export default function Create({
  isOpen,
  onOpenChange,
  onClose,
}: Readonly<{
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose: () => void
}>) {
  const queryClient = useQueryClient()

  const uploadService = useMediaUpload()
  const [files, setFiles] = useState<FilePreview[]>([])
  const [deletedFiles, setDeletedFiles] = useState<FilePreview[]>([])
  const captionRef = useRef<string>("")

  const handleSubmit = async () => {
    const caption = captionRef.current
    if (files.length === 0 && caption.length === 0) {
      return
    }

    const { success, failed } = await uploadService.uploadFilePreviews(files)

    if (failed.length > 0) {
      // Handle failed uploads
      console.error("Failed to upload files:", failed)
    }

    return await createPost({
      caption,
      media: success.map<MediaItemDTO>((frv) => ({
        url: frv.preview,
        type: frv.type,
      })),
    })
  }

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (result) => {
      if (result!.status !== 200) {
        console.error("Failed to create post:", result!.message)
      } else {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_POSTS],
          exact: false,
        })
        setFiles([])
        captionRef.current = ""
        onClose()
      }
    },
  })
  const contextValue = useMemo(
    () => ({
      files,
      setFiles,
      captionRef,
      handleSubmit: mutation.mutate,
      isPending: mutation.isPending,
      deletedFiles,
      setDeletedFiles,
    }),
    [
      files,
      setFiles,
      captionRef,
      mutation.mutate,
      mutation.isPending,
      deletedFiles,
      setDeletedFiles,
    ]
  )

  return (
    <MutatePostContext.Provider value={contextValue}>
      <MutatePostModal
        title="Create new post"
        submitButtonName="Share"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </MutatePostContext.Provider>
  )
}
