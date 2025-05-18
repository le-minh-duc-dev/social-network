import { Types } from "mongoose"
import { Role } from "@/domain/enums/Role"
import { PostPrivacy } from "@/domain/enums/PostPrivacy"
import { NotificationType } from "@/domain/enums/NotificationType"

export type UserCountableField =
  | "postsCount"
  | "followersCount"
  | "followingCount"

export type FollowStatus = "requesting" | "following" | "notFollowing"

export interface User {
  _id: string | Types.ObjectId
  username: string
  email: string
  password?: string
  fullName: string
  normalizedFullName: string
  bio?: string
  avatarUrl?: string
  postsCount: number
  followersCount: number
  followingCount: number
  role: Role
  isActive: boolean
  isVerified: boolean
  isFollowApprovalRequired: boolean
  createdAt: Date
  updatedAt: Date
}

export interface MediaItem {
  type: "IMAGE" | "VIDEO"
  url: string
}

export interface Post {
  _id: string | Types.ObjectId
  author: string | User
  caption?: string
  media: MediaItem[]
  privacy: PostPrivacy
  likeCount: number
  commentCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id: string | Types.ObjectId
  post: string | Types.ObjectId
  author: string | User
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface Follow {
  _id: string | Types.ObjectId
  follower: string | User
  following: string | User
  isAccepted: boolean
  createdAt: Date
  updatedAt: Date
}
export interface Like {
  post: string | Post
  user: string | User
  createdAt: Date
  updatedAt: Date
}

export interface Saved {
  _id: string | Types.ObjectId
  post: string | Post
  user: string | User
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  _id?: string | Types.ObjectId
  recipient: string | User | Types.ObjectId
  sender?: string | User | Types.ObjectId
  type: NotificationType
  post?: string | Post | Types.ObjectId
  comment?: string | Comment | Types.ObjectId
  like?: string | Like | Types.ObjectId
  follow?: string | Follow | Types.ObjectId
  content?: string
  isRead?: boolean
  createdAt?: Date
}
