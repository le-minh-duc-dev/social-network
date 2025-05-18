// src/models/User.ts
import { Notification } from "@/types/schema"
import mongoose, { Schema } from "mongoose"
import { NotificationType } from "../enums/NotificationType"

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
      enum: Object.values(NotificationType),
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
    like: {
      type: Schema.Types.ObjectId,
      ref: "Like",
    },
    follow: {
      type: Schema.Types.ObjectId,
      ref: "Follow",
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
