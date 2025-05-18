import { useMutation, useQueryClient } from "@tanstack/react-query"
import React from "react"
import ConfirmModal from "../ConfirmModal"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { addToast } from "@heroui/react"
import { QueryKey } from "@/domain/enums/QueryKey"
import { ToastHelper } from "@/lib/ToastHelper"
import { deleteComment } from "@/actions/comment/deleteComment"

export default function DeleteComment({
  isOpen,
  onOpenChange,
  onClose,
  commentId,
  postId,
}: Readonly<{
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onClose: () => void
  commentId: string
  postId: string
}>) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () => {
      console.log("delete comment", commentId)
      return await deleteComment(commentId)
    },
    onSuccess: (response) => {
      if (response.status == HttpStatus.NO_CONTENT) {
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_POST_COMMENTS, postId],
        })
        onClose()
        addToast({
          title: "Comment deleted successfully!",
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
      ToastHelper.makeMutationErrorToast()
    },
  })

  return (
    <ConfirmModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      action={() => {
        mutation.mutate()
      }}
      isLoading={mutation.isPending}
      message="Are you sure to delete this comment?"
    />
  )
}
