import { z } from "zod"
import { PostPrivacy } from "../enums/PostPrivacy"
import { MediaType } from "../enums/MediaType"

export const MediaItemDTOSchema = z.object({
  type: z.enum([MediaType.IMAGE, MediaType.VIDEO]),
  url: z.string().url(),
})

export type MediaItemDTO = z.infer<typeof MediaItemDTOSchema>

export const PostUploadSchema = z.object({
  caption: z.string().optional(),
  media: z.array(MediaItemDTOSchema),
  privacy: z.enum([
    PostPrivacy.PUBLIC,
    PostPrivacy.FOLLOWERS,
    PostPrivacy.PRIVATE,
  ]),
})

export type PostUploadType = z.infer<typeof PostUploadSchema>
