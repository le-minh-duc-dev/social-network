import { createComment } from "@/actions/comment/createComment"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey } from "@/domain/enums/QueryKey"
import { CommentUploadSchema } from "@/domain/zod/CommentUploadSchema"
import { addToast } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useState } from "react"

export default function CommentForm({ postId }: Readonly<{ postId: string }>) {
  const [inputValue, setInputValue] = useState("")
  const queryClient = useQueryClient()
  const handleCreateComment = async (): Promise<IResponse<string>> => {
    const parsedComment = CommentUploadSchema.safeParse({ content: inputValue })
    if (!parsedComment.success) {
      console.error(parsedComment.error)
      throw new Error("Invalid comment data")
    }
    const safeComment = parsedComment.data
    return await createComment(postId, safeComment)
  }

  const { mutate } = useMutation({
    mutationFn: handleCreateComment,
    onSuccess: (response) => {
      if (response.status != HttpStatus.CREATED) {
        addToast({
          title: response.errors
            ? response.errors[0]
            : HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
        })
        return
      }

      setInputValue("")

      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_POST_COMMENTS],
        exact: false,
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_POST, postId],
      })
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_POSTS],
        exact: false,
      })

      addToast({
        title: "Comment created successfully!",
      })
    },
    onError: () => {
      addToast({
        title: HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR],
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        onChange={(e) => setInputValue(e.target.value)}
        value={inputValue}
        placeholder="Add a comment..."
        type="text"
        className=" focus-within:bg-transparent focus-within:outline-none w-full bg-transparent pb-1 text-sm"
      />
      {inputValue.length > 0 && (
        <button
          type="submit"
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Post
        </button>
      )}
    </form>
  )
}
