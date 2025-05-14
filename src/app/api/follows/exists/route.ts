import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { FollowService } from "@/service/FollowService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const followingId = searchParams.get("followingId")

  if (!followingId) {
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  const authUser = await ServerSideAuthService.getAuthUser()

  let followingObjectId
  let followerObjectId
  try {
    followingObjectId = MongooseHelper.toObjectId(followingId)
    followerObjectId = MongooseHelper.toObjectId(authUser!.id)
  } catch (error) {
    console.error("Invalid postId:", followingId, error)
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  await RouteProtector.protect()
  //connect to the database
  await connectDB()

  //post service
  const followService = new FollowService()

  //get posts
  const result = await followService.existsFollowByFollowerAndFollowing(
    followerObjectId,
    followingObjectId
  )

  return Response.json({
    exists: result != null,
  })
}
