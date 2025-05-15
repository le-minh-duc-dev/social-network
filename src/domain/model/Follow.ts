import { Follow } from "@/types/schema"
import mongoose, { Schema } from "mongoose"

const FollowSchema = new Schema<Follow>(
  {
    follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAccepted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

FollowSchema.index({ follower: 1, following: 1 }, { unique: true })

export default mongoose.models.Follow ||
  mongoose.model<Follow>("Follow", FollowSchema)
