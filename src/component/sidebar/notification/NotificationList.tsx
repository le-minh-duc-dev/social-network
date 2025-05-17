import { InfiniteVirtualList } from "@/component/InfiniteVirtualList"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { NotificationAPI } from "@/service/api/NotificationAPI"
import { Notification as NotificationType } from "@/types/schema"
import { Spinner } from "@heroui/react"
import React from "react"
import NewUserJoinedNotification from "./NewUserJoinedNotification"

const FETCH_SIZE = 10

export default function NotificationList() {
  const renderItem = (notification: NotificationType) => {
    switch (notification.type) {
      case "NEW_USER_JOINED":
        return <NewUserJoinedNotification notification={notification} />
    }
  }
  return (
    <InfiniteVirtualList<NotificationType>
      queryKey={[QueryKey.GET_USERS, "NOTIFICATION"]}
      fetchFn={async (pageParam: string) => {
        return await NotificationAPI.getNotifications(pageParam, FETCH_SIZE)
      }}
      renderItem={renderItem}
      Skeleton={LoadingComponent}
      EmptyComponent={EmptyComponent}
      staleTime={QueryStaleTime[QueryKey.GET_USERS]}
      refetchInterval={30000}
    />
  )
}

function LoadingComponent() {
  return <Spinner />
}

function EmptyComponent() {
  return <p className="text-center text-gray-500">No result</p>
}
