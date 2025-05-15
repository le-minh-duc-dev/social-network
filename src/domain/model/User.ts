// src/models/User.ts
import { User } from "@/types/schema"
import mongoose, { Schema } from "mongoose"
import { Role } from "../enums/Role"

const UserSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    fullName: { type: String, required: true },
    bio: { type: String },
    avatarUrl: { type: String },
    role: {
      type: String,
      enum: [Role.ADMIN, Role.MEMBER],
      default: Role.MEMBER,
      required: true,
    },
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    isFollowApprovalRequired: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<User>("User", UserSchema)
