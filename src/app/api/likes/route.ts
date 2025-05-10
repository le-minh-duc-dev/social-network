import { RouteProtector } from "@/auth/RouteProtector"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { LikeService } from "@/service/LikeService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get("postId")
  const limit = parseInt(searchParams.get("limit") ?? "10")
  const cursor = searchParams.get("nextCursor") // last post ID

  if (!postId) {
    return new Response(null, { status: 400 })
  }

  let postObjectId
  try {
    postObjectId = MongooseHelper.toObjectId(postId)
  } catch (error) {
    console.error("Invalid postId:", postId, error)
    return new Response(null, { status: 400 })
  }

  await RouteProtector.protect()
  //connect to the database
  await connectDB()

  //post service
  const likeService = new LikeService()

  //get posts
  const result = await likeService.getInfiniteLikes(postObjectId, cursor, limit)

  //check if there are more posts
  const hasMore = result.length > limit
  const likes = hasMore ? result.slice(0, limit) : result

  //next cursor
  const nextCursor = hasMore ? likes[likes.length - 1]._id.toString() : null

  return Response.json({
    likes,
    nextCursor,
    hasMore,
  })
}
