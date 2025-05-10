import { Comment } from "@/types/schema"
import mongoose, { Schema } from "mongoose"

const CommentSchema = new Schema<Comment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Comment ||
  mongoose.model<Comment>("Comment", CommentSchema)
