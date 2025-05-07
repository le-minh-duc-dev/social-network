// src/models/User.ts
import { UserDoc } from "@/types/schema"
import mongoose, { Schema } from "mongoose"
import { Role } from "../enums/Role"

const UserSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, index:true },
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
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.User ||
  mongoose.model<UserDoc>("User", UserSchema)
