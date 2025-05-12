import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { LikeService } from "@/service/LikeService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get("postId")

  if (!postId) {
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  const user = await ServerSideAuthService.getAuthUser()
  const userObjectId = MongooseHelper.toObjectId(user!.id)

  let postObjectId
  try {
    postObjectId = MongooseHelper.toObjectId(postId)
  } catch (error) {
    console.error("Invalid postId:", postId, error)
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  await RouteProtector.protect()
  //connect to the database
  await connectDB()

  //post service
  const likeService = new LikeService()

  //get posts
  const result = await likeService.existsLikeByUserAndPostId(
    userObjectId,
    postObjectId
  )

  return Response.json({
    exists: result != null,
  })
}
