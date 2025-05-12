import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"
import ConfirmModal from "../ConfirmModal"
import { deletePost } from "@/actions/post/deletePost"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { addToast } from "@heroui/react"
import { QueryKey } from "@/domain/enums/QueryKey"

export default function DeletePost({
  isOpen,
  onOpenChange,
  onClose,
  postId,
}: Readonly<{
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose: () => void
  postId: string
}>) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      return await deletePost(postId)
    },
    onSuccess: (response) => {
      if (response.status == HttpStatus.NO_CONTENT) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_POSTS],
        })
        onClose()
        addToast({
          title: "Post deleted successfully!",
        })
      } else {
        addToast({
          title: response.errors
            ? response.errors[0]
            : HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
        })
      }
    },
    onError: () => {
      addToast({
        title: HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
      })
    },
  })

  return (
    <ConfirmModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      action={() => {
        mutation.mutate()
      }}
      message="Are you sure to delete this post"
    />
  )
}
