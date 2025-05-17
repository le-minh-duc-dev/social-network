import { QueryKey } from "@/domain/enums/QueryKey"
import { NotificationAPI } from "@/service/api/NotificationAPI"
import { Badge } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { ReactNode } from "react"

export default function NotificationIcon({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { data, isLoading } = useQuery({
    queryFn: async () => await NotificationAPI.getNewNotificationCount(),
    queryKey: [QueryKey.GET_USERS, "NOTIFICATION", "COUNT"],
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  })
  console.log(data?.count)
  if (isLoading || !data?.count) {
    return children
  }
  return (
    <Badge color="danger" content={data?.count ?? 0}>
      {children}
    </Badge>
  )
}
