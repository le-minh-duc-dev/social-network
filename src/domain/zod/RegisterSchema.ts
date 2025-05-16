import { z } from "zod"

export const RegisterUploadSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type RegisterUploadType = z.infer<typeof RegisterUploadSchema>

export const RegisterClientSchema = RegisterUploadSchema.extend({
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})

export type RegisterClientType = z.infer<typeof RegisterClientSchema>
