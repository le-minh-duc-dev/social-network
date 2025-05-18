import { toggleIsRead } from "@/actions/notification/toggleIsRead"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey } from "@/domain/enums/QueryKey"
import { ToastHelper } from "@/lib/ToastHelper"
import { Notification } from "@/types/schema"
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Tooltip,
} from "@heroui/react"
import { useQueryClient } from "@tanstack/react-query"

import React from "react"
import { MdClearAll } from "react-icons/md"

export default function NotificationTypeWrapper({
  notification,
  title,
  children,
}: Readonly<{
  notification: Notification
  title: string
  children: (props: { markAsRead: () => Promise<void> }) => React.ReactNode
}>) {
  const queryClient = useQueryClient()

  const markAsRead = async () => {
    console.log("marking as read: ", notification._id);
    const response = await toggleIsRead(notification._id!.toString(), true)
    if (response.status == HttpStatus.NO_CONTENT) {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_USERS, "NOTIFICATION"],
        exact: false,
      })
    } else {
      ToastHelper.makeMutationErrorToast()
    }
  }

  return (
    <Card className="max-w-[340px] mt-4">
      <CardHeader className="justify-between  ">
        <Alert
          title={title}
          color={notification.isRead ? "default" : "primary"}
          className={notification.isRead ? "opacity-50" : "opacity-100"}
          endContent={
            <Tooltip content="Mark as read">
              <Button
                isIconOnly
                variant="flat"
                color={notification.isRead ? "default" : "primary"}
                radius="full"
                isDisabled={notification.isRead}
                onPress={() => {
                  markAsRead()
                }}
              >
                <MdClearAll className="text-xl" />
              </Button>
            </Tooltip>
          }
        />
      </CardHeader>
      <CardBody className="px-3 py-4 text-small flex-row justify-between items-center">
        {children({
          markAsRead,
        })}
      </CardBody>
    </Card>
  )
}
