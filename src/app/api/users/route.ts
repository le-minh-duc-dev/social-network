// app/api/posts/route.ts (App Router)
import { RouteProtector } from "@/auth/RouteProtector"
import connectDB from "@/lib/connectDB"
import { UserService } from "@/service/UserService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get("limit") ?? "10")
  const cursor = searchParams.get("nextCursor") // last post ID
  const searchKey = searchParams.get("searchKey") // search key

  await RouteProtector.protect()
  //connect to the database
  await connectDB()

  //post service
  const userService = new UserService()

  //get posts
  const result = await userService.getInfiniteUsers(cursor, limit, searchKey)

  //check if there are more posts
  const hasMore = result.length > limit
  const users = hasMore ? result.slice(0, limit) : result

  //next cursor
  const nextCursor = hasMore ? users[users.length - 1]._id.toString() : null

  return Response.json({
    list: users,
    nextCursor,
    hasMore,
  })
}
