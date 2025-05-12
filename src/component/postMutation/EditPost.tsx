import React, { useEffect, useMemo, useRef, useState } from "react"
import MutatePostModal from "./MutatePostModal"
import { useMediaUpload } from "@/context/MediaUploadContext"
import { FilePreview } from "@/types/FilePreview"
import { MediaItemDTO } from "@/domain/zod/PostUploadSchema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKey } from "@/domain/enums/QueryKey"
import { MutatePostContext } from "./MutatePostContext"
import { Post } from "@/types/schema"
import { v4 as uuidv4 } from "uuid"
import { MediaType } from "@/domain/enums/MediaType"
import { updatePost } from "@/actions/post/updatePost"
import { addToast } from "@heroui/react"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"

export default function EditPost({
  isOpen,
  onOpenChange,
  onClose,
  post,
}: Readonly<{
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose: () => void
  post: Post
}>) {
  const queryClient = useQueryClient()

  const uploadService = useMediaUpload()
  const [files, setFiles] = useState<FilePreview[]>(
    post.media.map<FilePreview>((item) => ({
      id: uuidv4(),
      file: null,
      preview: item.url,
      type: item.type as MediaType,
      size: "",
    }))
  )
  const [deletedFiles, setDeletedFiles] = useState<FilePreview[]>([])
  const captionRef = useRef<string>(post.caption ?? "")

  useEffect(() => {
    setFiles(
      post.media.map<FilePreview>((item) => ({
        id: uuidv4(),
        file: null,
        preview: item.url,
        type: item.type as MediaType,
        size: "",
      }))
    )

    setDeletedFiles([])
    captionRef.current = post.caption ?? ""
  }, [post])

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

    console.log("success", success)

    return await updatePost(
      post._id.toString(),
      {
        caption,
        media: success.map<MediaItemDTO>((frv) => ({
          url: frv.preview,
          type: frv.type,
        })),
      },
      deletedFiles
        .filter((files) => files.preview.startsWith("http"))
        .map((file) => file.preview)
    )
  }

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (response) => {
      if (!response) return
      if (response.status != HttpStatus.NO_CONTENT) {
        addToast({
          title: response.errors
            ? response.errors[0]
            : HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
        })
        return
      }
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_POSTS],
        exact: false,
      })
      addToast({
        title: "Post updated successfully!",
      })
      onClose()
    },
    onError: () => {
      addToast({
        title: HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
      })
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
        title="Update post"
        submitButtonName="Update"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </MutatePostContext.Provider>
  )
}
