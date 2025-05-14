import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { SavedService } from "@/service/SavedService"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const postId = searchParams.get("postId")

  if (!postId) {
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  const user = await ServerSideAuthService.getAuthUser()

  let postObjectId
  let userObjectId
  try {
    postObjectId = MongooseHelper.toObjectId(postId)
    userObjectId = MongooseHelper.toObjectId(user!.id)
  } catch (error) {
    console.error("Invalid postId:", postId, error)
    return new Response(null, { status: HttpStatus.BAD_REQUEST })
  }

  await RouteProtector.protect()
  //connect to the database
  await connectDB()

  //post service
  const savedService = new SavedService()

  //get posts
  const result = await savedService.existsSavedByUserAndPostId(
    userObjectId,
    postObjectId
  )

  return Response.json({
    exists: result != null,
  })
}
