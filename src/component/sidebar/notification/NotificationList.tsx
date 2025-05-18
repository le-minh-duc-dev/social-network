import { InfiniteVirtualList } from "@/component/InfiniteVirtualList"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { NotificationAPI } from "@/service/api/NotificationAPI"
import { Notification, User } from "@/types/schema"
import { Spinner } from "@heroui/react"
import React from "react"
import NewUserJoinedNotification from "./notificationTypes/NewUserJoinedNotification"
import { NotificationType } from "@/domain/enums/NotificationType"
import FollowRequestNotification from "./notificationTypes/FollowRequestNotification"
import FollowAcceptedNotification from "./notificationTypes/FollowAcceptedNotification"
import NotificationTypeWrapper from "./notificationTypes/NotificationTypeWrapper"
import LikeNotification from "./notificationTypes/LikeNotification"

const FETCH_SIZE = 10
const REFETCH_INTERVAL = 15 * 1000 // 15 seconds

const NotificationRendererMap: Partial<
  Record<
    NotificationType,
    React.FC<{ notification: Notification; markAsRead: () => Promise<void> }>
  >
> = {
  [NotificationType.NEW_USER_JOINED]: NewUserJoinedNotification,
  [NotificationType.FOLLOW_REQUEST]: FollowRequestNotification,
  [NotificationType.FOLLOW_ACCEPTED]: FollowAcceptedNotification,
  [NotificationType.LIKE]: LikeNotification,
}

const NotificationTitleMap: Partial<
  Record<NotificationType, (notification: Notification) => string>
> = {
  [NotificationType.NEW_USER_JOINED]: (notification) => {
    const sender = notification.sender as User
    return `${sender.fullName} has joined the platform`
  },
  [NotificationType.FOLLOW_REQUEST]: (notification) => {
    const sender = notification.sender as User
    return `${sender.fullName} has sent you a follow request`
  },
  [NotificationType.FOLLOW_ACCEPTED]: (notification) => {
    const sender = notification.sender as User
    return `${sender.fullName} has accepted your follow request`
  },
  [NotificationType.LIKE]: (notification) => {
    const sender = notification.sender as User
    return `${sender.fullName} has liked your post`
  },
}
export default function NotificationList() {
  const renderItem = (notification: Notification) => {
    const Component = NotificationRendererMap[notification.type]

    const titleFn = NotificationTitleMap[notification.type]
    const title = titleFn ? titleFn(notification) : "New notification"
    if (!Component) return null

    return (
      <NotificationTypeWrapper notification={notification} title={title}>
        {({ markAsRead }) => (
          <Component notification={notification} markAsRead={markAsRead} />
        )}
      </NotificationTypeWrapper>
    )
  }
  return (
    <InfiniteVirtualList<Notification>
      queryKey={[QueryKey.GET_USERS, "NOTIFICATION"]}
      fetchFn={async (pageParam: string) => {
        return await NotificationAPI.getNotifications(pageParam, FETCH_SIZE)
      }}
      renderItem={renderItem}
      Skeleton={LoadingComponent}
      EmptyComponent={EmptyComponent}
      staleTime={QueryStaleTime[QueryKey.GET_USERS]}
      refetchInterval={REFETCH_INTERVAL}
    />
  )
}

function LoadingComponent() {
  return <Spinner />
}

function EmptyComponent() {
  return <p className="text-center text-gray-500">No result</p>
}
