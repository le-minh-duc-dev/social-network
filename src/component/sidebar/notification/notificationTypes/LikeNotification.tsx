import { AppRouteManager } from "@/service/AppRouteManager"
import { Notification, User as UserType } from "@/types/schema"
import { Button, User } from "@heroui/react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { MdVerified } from "react-icons/md"

export default function LikeNotification({
  notification,
  markAsRead,
}: Readonly<{
  notification: Notification
  markAsRead: () => Promise<void>
}>) {
  const sender = notification.sender as UserType

  const router = useRouter()
  return (
    <>
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
      <Button
        color="primary"
        radius="full"
        size="sm"
        onPress={() => {
          if (!notification.isRead) {
            markAsRead()
          }
          router.push(
            AppRouteManager.posts((notification.post as string) ?? "")
          )
        }}
      >
        Go to post
      </Button>
    </>
  )
}
