import { Avatar } from "@heroui/react"
import React from "react"

export default function StoryAvatar({
  avatarUrl,
}: {
  avatarUrl: string | undefined
}) {
  return (
    <div className="relative ">
      <div className="absolute scale-105 inset-0 rounded-full p-1 bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 "></div>
      <Avatar className="w-14 h-14 border-3 border-black" src={avatarUrl} />
    </div>
  )
}
