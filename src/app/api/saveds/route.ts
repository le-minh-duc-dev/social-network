import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { SavedService } from "@/service/SavedService"
import { Post } from "@/types/schema"
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
  const savedService = new SavedService()

  //get posts
  const result = await savedService.getInfiniteSaveds(
    userObjectId,
    cursor,
    limit
  )

  //check if there are more posts
  const hasMore = result.length > limit
  const saveds = hasMore ? result.slice(0, limit) : result

  const posts = saveds.map((saved) => {
    return saved.post as Post
  })

  //next cursor
  const nextCursor = hasMore ? saveds[saveds.length - 1]._id.toString() : null

  return Response.json({
    list: posts,
    nextCursor,
    hasMore,
  })
}
