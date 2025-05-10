"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"

import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { LikeService } from "@/service/LikeService"
import { PostService } from "@/service/PostService"
import mongoose from "mongoose"
export async function deleteLike(postId: string): Promise<IResponse<string>> {
  await RouteProtector.protect()

  // services
  const likeService = new LikeService()
  const postService = new PostService()
  ///

  //get user
  const user = await ServerSideAuthService.getAuthUser()

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()
    const userObjectId = MongooseHelper.toObjectId(user!.id)
    const postObjectId = MongooseHelper.toObjectId(postId)
    await likeService.deleteLike(userObjectId, postObjectId, dbSession)

    //increment Like count
    await postService.decrementLikeCount(postObjectId, dbSession)
    //commit transaction
    await dbSession.commitTransaction()
    return {
      status: 200,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error delete Like:", error)
  }
  return {
    status: 500,
    message: "Failed to delete Like",
    errors: ["Something went wrong!"],
  }
}
