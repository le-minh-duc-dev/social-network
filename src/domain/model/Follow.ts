import { FollowDoc } from "@/types/schema"
import mongoose, { Schema } from "mongoose"

const FollowSchema = new Schema<FollowDoc>(
  {
    follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

FollowSchema.index({ follower: 1, following: 1 }, { unique: true })

export default mongoose.models.Follow ||
  mongoose.model<FollowDoc>("Follow", FollowSchema)
