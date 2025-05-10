import { Like } from "@/types/schema"
import mongoose, { Schema } from "mongoose"

const LikeSchema = new Schema<Like>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

LikeSchema.index({ post: 1, user: 1 }, { unique: true })

export default mongoose.models.Like ||
  mongoose.model<Like>("Like", LikeSchema)
