"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"

import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { LikeService } from "@/service/LikeService"
import { NotificationService } from "@/service/NotificationService"
import { PostService } from "@/service/PostService"
import mongoose from "mongoose"
import { after } from "next/server"
export async function createLike(postId: string): Promise<IResponse<string>> {
  await RouteProtector.protect()

  // services
  const likeService = new LikeService()
  const postService = new PostService()
  const notificationService = new NotificationService()
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
    await likeService.createLike(userObjectId, postObjectId, dbSession)

    //increment Like count
    await postService.incrementLikeCount(postObjectId, dbSession)

    await dbSession.commitTransaction()
    //notify post owner
    after(async () => {
      await notificationService.createLikeNotification(
        postObjectId,
        userObjectId
      )
    })
    //commit transaction

    return {
      status: HttpStatus.CREATED,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error creating Like:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
