import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { NotificationService } from "@/service/NotificationService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get("limit") ?? "10")
  const cursor = searchParams.get("nextCursor")

  await RouteProtector.protect()

  const authUser = await ServerSideAuthService.getAuthUser()
  const authUserObjectId = MongooseHelper.toObjectId(authUser?.id ?? "")

  //connect to the database
  await connectDB()

  //post service
  const notificationService = new NotificationService()

  //get Notifications
  const result = await notificationService.getInfiniteNotifications(
    authUserObjectId,
    cursor,
    limit
  )

  const hasMore = result.length > limit
  const notifications = hasMore ? result.slice(0, limit) : result

  //next cursor
  const nextCursor = hasMore
    ? notifications[notifications.length - 1]._id.toString()
    : null

  return Response.json({
    list: notifications,
    nextCursor,
    hasMore,
  })
}
