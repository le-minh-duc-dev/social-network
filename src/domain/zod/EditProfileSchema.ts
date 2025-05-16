import { z } from "zod"

export const EditProfileSchema = z.object({
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  isFollowApprovalRequired: z.boolean().optional(),
})

export type EditProfileType = z.infer<typeof EditProfileSchema>
