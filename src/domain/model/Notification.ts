// src/models/User.ts
import { Notification } from "@/types/schema"
import mongoose, { Schema } from "mongoose"

const NotificationSchema = new Schema<Notification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "LIKE",
        "COMMENT",
        "FOLLOW",
        "MENTION",
        "REPLY",
        "NEW_USER_JOINED",
      ],
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Notification ||
  mongoose.model<Notification>("Notification", NotificationSchema)
