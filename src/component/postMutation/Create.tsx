"use client"

import React, { useMemo, useRef, useState } from "react"
import MutatePostModal from "./MutatePostModal"
import { useMediaUpload } from "@/context/MediaUploadContext"
import { createPost } from "@/actions/post/createPost"
import { FilePreview } from "@/types/FilePreview"
import { MediaItemDTO } from "@/domain/zod/PostUploadSchema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QueryKey } from "@/domain/enums/QueryKey"
import { MutatePostContext } from "./MutatePostContext"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { addToast } from "@heroui/react"
import { PostPrivacy } from "@/domain/enums/PostPrivacy"
import {  useRouter } from "next/navigation"
import { AppRouteManager } from "@/service/AppRouteManager"

export default function Create() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const uploadService = useMediaUpload()
  const [files, setFiles] = useState<FilePreview[]>([])
  const [deletedFiles, setDeletedFiles] = useState<FilePreview[]>([])
  const captionRef = useRef<string>("")
  const privacyRef = useRef<PostPrivacy>(PostPrivacy.PUBLIC)

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
      privacy: privacyRef.current,
    })
  }

  const mutation = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (response) => {
      if (!response) return
      if (response.status != HttpStatus.CREATED) {
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
        title: "Post created successfully!",
      })
      setFiles([])
      captionRef.current = ""
      privacyRef.current = PostPrivacy.PUBLIC
      router.push(response.data ?? AppRouteManager.HOME)
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
      privacyRef,
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
        isOpen={true}
        onOpenChange={() => {
          router.back()
        }}
      />
    </MutatePostContext.Provider>
  )
}
