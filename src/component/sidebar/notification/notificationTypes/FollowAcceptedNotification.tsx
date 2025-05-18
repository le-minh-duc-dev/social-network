import { AppRouteManager } from "@/service/AppRouteManager"
import { Notification, User as UserType } from "@/types/schema"
import { User } from "@heroui/react"
import Link from "next/link"
import React from "react"
import { MdVerified } from "react-icons/md"

export default function FollowAcceptedNotification({
  notification,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  markAsRead,
}: Readonly<{
  notification: Notification
  markAsRead: () => void
}>) {
  const sender = notification.sender as UserType

  return (
    <User
      avatarProps={{
        src: sender.avatarUrl,
      }}
      name={
        <div className="flex items-center gap-x-1">
          <Link
            href={AppRouteManager.profile(sender._id.toString())}
            className="font-semibold"
          >
            {sender.username ?? sender.fullName}
          </Link>
          {sender.isVerified && <MdVerified className="text-blue-500" />}
        </div>
      }
      description={sender.fullName}
    />
  )
}
