import { z } from "zod"

export const MediaItemDTOSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO"]),
  url: z.string().url(),
})

export type MediaItemDTO = z.infer<typeof MediaItemDTOSchema>

export const PostUploadSchema = z.object({
  caption: z.string().optional(),
  media: z.array(MediaItemDTOSchema),
})

export type PostUploadType = z.infer<typeof PostUploadSchema>
