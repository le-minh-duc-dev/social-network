/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/posts/route.ts (App Router)
import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { NotificationService } from "@/service/NotificationService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  await RouteProtector.protect()

  const searchParams = request.nextUrl.searchParams
  const isRead = searchParams.get("isRead")

  const query: any = {}
  if (isRead) {
    query.isRead = isRead == "true"
  }

  const authUser = await ServerSideAuthService.getAuthUser()
  const authUserObjectId = MongooseHelper.toObjectId(authUser?.id ?? "")

  query.recipient = authUserObjectId

  //connect to the database
  await connectDB()

  //user service
  const notificationService = new NotificationService()

  //count notifications
  const count = await notificationService.getNotificationCount(query)

  return Response.json({
    count,
  })
}
