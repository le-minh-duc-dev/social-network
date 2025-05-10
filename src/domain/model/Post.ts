import { MediaItem, Post } from "@/types/schema"
import mongoose, { Schema } from "mongoose"
import { PostPrivacy } from "../enums/PostPrivacy"

const MediaSchema = new Schema<MediaItem>(
  {
    type: { type: String, enum: ["IMAGE", "VIDEO"], required: true },
    url: { type: String, required: true },
  },
  { _id: false }
)

const PostSchema = new Schema<Post>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String },
    media: { type: [MediaSchema], default: [] },
    privacy: {
      type: String,
      enum: Object.values(PostPrivacy),
      default: PostPrivacy.PUBLIC,
    },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Post || mongoose.model<Post>("Post", PostSchema)
