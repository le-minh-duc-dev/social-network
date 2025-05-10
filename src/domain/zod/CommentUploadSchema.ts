import { z } from "zod"

export const CommentUploadSchema = z.object({
  content: z.string().max(500, "Comment must be at most 500 characters long"),
})

export type CommentUploadType = z.infer<typeof CommentUploadSchema>
