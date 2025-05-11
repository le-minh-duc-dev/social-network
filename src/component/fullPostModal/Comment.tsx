import { Formater } from "@/lib/Formater"
import { Avatar, Button } from "@heroui/react"
import React from "react"
import { FaRegHeart } from "react-icons/fa"

export default function Comment({
  name,
  avatarUrl,
  content,
  createdAt,
  isComment = true,
}: Readonly<{
  name: string
  avatarUrl: string | undefined
  content: string
  isComment?: boolean
  createdAt: Date
}>) {
  return (
    <div className="flex gap-x-2">
      <Avatar src={avatarUrl} size="sm" />
      <div className="flex-1 mt-1">
        <p className="text-sm">
          <span className="font-semibold">{name}</span>
          <span className="">{" " + content}</span>
        </p>
        <div className="text-default-400 text-sm mt-1">
          {Formater.formatTimeAgo(createdAt)}
        </div>
      </div>
      {isComment && (
        <div className="">
          <Button isIconOnly variant="light">
            <FaRegHeart className="" />
          </Button>
        </div>
      )}
    </div>
  )
}
