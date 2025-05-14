import { Saved } from "@/types/schema"
import mongoose, { Schema } from "mongoose"

const SavedSchema = new Schema<Saved>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
)

SavedSchema.index({ user: 1, post: 1 }, { unique: true })

export default mongoose.models.Saved ||
  mongoose.model<Saved>("Saved", SavedSchema)
