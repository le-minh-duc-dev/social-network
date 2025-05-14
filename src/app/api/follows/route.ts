import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { FollowService } from "@/service/FollowService"
import { User } from "@/types/schema"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get("limit") ?? "10")
  const cursor = searchParams.get("nextCursor") // last post ID

  await RouteProtector.protect()

  const authUser = await ServerSideAuthService.getAuthUser()

  let userObjectId
  try {
    userObjectId = MongooseHelper.toObjectId(authUser!.id)
  } catch (error) {
    console.error("Invalid userId:", authUser!.id, error)
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  //connect to the database
  await connectDB()

  //post service
  const followService = new FollowService()

  //get posts
  const result = await followService.getInfiniteFollows(
    userObjectId,
    cursor,
    limit
  )

  //check if there are more posts
  const hasMore = result.length > limit
  const followList = hasMore ? result.slice(0, limit) : result

  const followingList = followList.map((follow) => {
    return follow.following as User
  })

  //next cursor
  const nextCursor = hasMore
    ? followList[followList.length - 1]._id.toString()
    : null

  return Response.json({
    list: followingList,
    nextCursor,
    hasMore,
  })
}
