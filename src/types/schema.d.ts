import { Types } from "mongoose"
import { Role } from "@/domain/enums/Role"
import { PostPrivacy } from "@/domain/enums/PostPrivacy"

export interface User {
  _id: string | Types.ObjectId
  username: string
  email: string
  password?: string
  fullName: string
  bio?: string
  avatarUrl?: string
  postsCount: number
  followersCount: number
  followingCount: number
  role: Role
  isActive: boolean
  isVerified: boolean
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
  follower: string | User
  following: string | User
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

