// app/api/posts/route.ts (App Router)
import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { PostPrivacy } from "@/domain/enums/PostPrivacy"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { PostService } from "@/service/PostService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get("limit") ?? "10")
  const cursor = searchParams.get("nextCursor") // last post ID
  const authorId = searchParams.get("authorId") // author ID
  const isExplore = searchParams.get("isExplore") == "true" // author ID

  await RouteProtector.protect()

  const authUser = await ServerSideAuthService.getAuthUser()
  const authUserObjectId = MongooseHelper.toObjectId(authUser?.id ?? "")

  let userObjectId

  if (authorId) {
    try {
      userObjectId = MongooseHelper.toObjectId(authorId ?? "")
    } catch (error) {
      console.error("Invalid userId:", authorId, error)

      return new Response(null, { status: HttpStatus.BAD_REQUEST })
    }
  }

  //connect to the database
  await connectDB()

  //post service
  const postService = new PostService()

  //get posts
  let result
  if (authorId) {
    if (authorId == authUser!.id) {
      result = await postService.getInfinitePosts(cursor, limit, userObjectId)
    } else {
      result = await postService.getInfinitePosts(cursor, limit, userObjectId, [
        PostPrivacy.PUBLIC,
      ])
    }
  } else {
    result = await postService.getInfinitePosts(
      cursor,
      limit,
      undefined,
      undefined,
      authUserObjectId,
      isExplore
    )
  }

  //check if there are more posts
  const hasMore = result.length > limit
  const posts = hasMore ? result.slice(0, limit) : result

  //next cursor
  const nextCursor = hasMore ? posts[posts.length - 1]._id.toString() : null

  return Response.json({
    list: posts,
    nextCursor,
    hasMore,
  })
}
