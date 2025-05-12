// app/api/posts/route.ts (App Router)
import { RouteProtector } from "@/auth/RouteProtector"
import connectDB from "@/lib/connectDB"
import { PostService } from "@/service/PostService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const limit = parseInt(searchParams.get("limit") ?? "10")
  const cursor = searchParams.get("nextCursor") // last post ID

  await RouteProtector.protect()
  //connect to the database
  await connectDB()

  //post service
  const postService = new PostService()

  //get posts
  const result = await postService.getInfinitePosts(cursor, limit)

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
