"use client"
import { Post } from "@/types/schema"
import React from "react"
import FullPostModal from "./fullPostModal/FullPostModal"

export default function SinglePost({ post }: Readonly<{ post: Post }>) {
  return (
    <FullPostModal post={post} isOpen={true} onClose={() => {}} showCloseBtn />
  )
}
