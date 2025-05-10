import { Document, Types } from "mongoose"
import { Role } from "@/domain/enums/Role"
import { PostPrivacy } from "@/domain/enums/PostPrivacy"

export interface UserDoc extends Document {
  _id: Types.ObjectId
  username: string
  email: string
  password?: string
  fullName: string
  bio?: string
  avatarUrl?: string
  followersCount: number
  followingCount: number
  role: Role
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MediaItem {
  type: "IMAGE" | "VIDEO"
  url: string
}

export interface PostDoc extends Document {
  author: Types.ObjectId
  caption?: string
  media: MediaItem[],
  privacy: PostPrivacy
  likeCount: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CommentDoc extends Document {
  post: Types.ObjectId
  author: Types.ObjectId
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface FollowDoc extends Document {
  follower: Types.ObjectId
  following: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
export interface LikeDoc extends Document {
  post: Types.ObjectId
  user: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
