// app/api/posts/route.ts (App Router)
import PostModel from "@/domain/model/Post"
import connectDB from "@/lib/connectDB"
import { Types } from "mongoose"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  await connectDB()

  const limit = parseInt(searchParams.get("limit") ?? "10")
  const cursor = searchParams.get("cursor") // last post ID

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {}
  if (cursor) {
    query._id = { $lt: new Types.ObjectId(cursor) }
  }

  const result = await PostModel.find(query)
    .sort({ _id: -1 }) // newest first
    .limit(limit + 1)
    .populate("author", "_id fullName avatarUrl")

  const hasMore = result.length > limit
  const posts = hasMore ? result.slice(0, limit) : result

  const nextCursor = hasMore ? posts[posts.length - 1]._id.toString() : null

  return Response.json({
    posts,
    nextCursor,
    hasMore,
  })
}
