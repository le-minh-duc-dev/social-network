import { createComment } from "@/actions/comment/createComment"
import { QueryKey } from "@/domain/enums/QueryKey"
import { CommentUploadSchema } from "@/domain/zod/CommentUploadSchema"
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
    onSuccess: (data) => {
      if (data.status === 200) {
        setInputValue("")
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_POST_COMMENTS, postId],
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_POST, postId],
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_POSTS],
          exact: false,
        })  
      } else {
        console.error(data.errors)
      }
    },
    onError: (error) => {
      console.error("Error creating comment:", error)
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
