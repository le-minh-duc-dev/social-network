import { toggleField } from "@/actions/user/toggleField"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { QueryKey } from "@/domain/enums/QueryKey"
import { ToastHelper } from "@/lib/ToastHelper"
import { AppRouteManager } from "@/service/AppRouteManager"
import { Notification, User as UserType } from "@/types/schema"
import { addToast, Button, User } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import React from "react"
import { MdVerified } from "react-icons/md"

export default function NewUserJoinedNotification({
  notification,
  markAsRead,
}: Readonly<{
  notification: Notification
  markAsRead: () => Promise<void>
}>) {
  const sender = notification.sender as UserType

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async () =>
      await Promise.all([
        markAsRead(),
        toggleField(sender._id.toString(), "isActive", true),
      ]),
    onSuccess: (response) => {
      if (response[1].status == HttpStatus.NO_CONTENT) {
        addToast({
          title:
            (sender.username ?? sender.fullName) +
            " is now " +
            (sender.isActive ? "inactive" : "active"),
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_USERS],
          exact: false,
        })
        queryClient.invalidateQueries({
          queryKey: [QueryKey.GET_USER],
          exact: false,
        })
      } else {
        ToastHelper.makeMutationErrorToast()
      }
    },
    onError: () => {
      ToastHelper.makeMutationErrorToast()
    },
  })
  return (
    <>
      <User
        avatarProps={{
          src: sender.avatarUrl,
        }}
        name={
          <div className="flex items-center gap-x-1">
            <Link
              href={AppRouteManager.userDetails(sender._id.toString())}
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
          mutation.mutate()
        }}
        isLoading={mutation.isPending}
        isDisabled={sender.isActive || mutation.isPending}
      >
        Activate account
      </Button>
    </>
  )
}
