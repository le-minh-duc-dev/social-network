import { RouteProtector } from "@/auth/RouteProtector"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { CommentService } from "@/service/CommentService"
import { Comment } from "@/types/schema"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
   await RouteProtector.protect()

  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get("postId")
  const limit = parseInt(searchParams.get("limit") ?? "10")
  const cursor = searchParams.get("nextCursor") // last post ID

  if (!postId) {
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  let postObjectId
  try {
    postObjectId = MongooseHelper.toObjectId(postId)
  } catch (error) {
    console.error("Invalid postId:", postId, error)
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

 
  //connect to the database
  await connectDB()

  //post service
  const commentService = new CommentService()

  //get posts
  const result = await commentService.getInfiniteComments(
    postObjectId,
    cursor,
    limit
  )

  //check if there are more posts
  const hasMore = result.length > limit
  const comments = hasMore ? result.slice(0, limit) : result

  //next cursor
  const nextCursor = hasMore
    ? comments[comments.length - 1]._id.toString()
    : null

  const response: InfiniteResponse<Comment> = {
    list: comments,
    nextCursor,
    hasMore,
  }

  return Response.json(response)
}
