import { Notification } from "@/types/schema"

const FETCH_SIZE = 10
export class NotificationAPI {
  static readonly baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL + "/api/notifications"

  static async getNotifications(
    nextCursor: string,
    limit: number = FETCH_SIZE
  ): Promise<InfiniteResponse<Notification>> {
    const res = await fetch(
      NotificationAPI.baseUrl + `?nextCursor=${nextCursor}&limit=${limit}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
