import { Formater } from "@/lib/Formater"
import { Avatar, Button } from "@heroui/react"
import React from "react"
import { FaRegHeart } from "react-icons/fa"
import { MdVerified } from "react-icons/md"

export default function Comment({
  name,
  avatarUrl,
  content,
  createdAt,
  isComment = true,
  isVerified = false
}: Readonly<{
  name: string
  avatarUrl: string | undefined
  content: string
  isComment?: boolean
  createdAt: Date,
  isVerified?:boolean
}>) {
  return (
    <div className="flex gap-x-2">
      <Avatar src={avatarUrl} size="sm" />
      <div className="flex-1 mt-1">
        <p className="text-sm">
          <span className="font-semibold">{name}</span>
          {isVerified && <MdVerified className="text-blue-500 inline-block ml-1" />}
          <span className="">{" " + content}</span>
        </p>
        <div className="text-default-400 text-xs mt-1">
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
