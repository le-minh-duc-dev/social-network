"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"

import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { FollowService } from "@/service/FollowService"
import { UserService } from "@/service/UserService"
import mongoose from "mongoose"
export async function deleteFollow(
  followingId: string
): Promise<IResponse<string>> {
  await RouteProtector.protect()

  // services
  const followService = new FollowService()
  const userService = new UserService()

  ///

  //get user
  const authUser = await ServerSideAuthService.getAuthUser()

  let followingObjectId
  let followerObjectId
  try {
    followingObjectId = MongooseHelper.toObjectId(followingId)
    followerObjectId = MongooseHelper.toObjectId(authUser!.id)
  } catch (error) {
    console.error("Invalid postId Or userId:", followingId, authUser!.id, error)

    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    const isDeleted = await followService.deletefollow(
      followerObjectId,
      followingObjectId,
      dbSession
    )

    if (!isDeleted) {
      return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
    }

    await userService.decrementCount(
      followerObjectId,
      "followingCount",
      dbSession
    )
    await userService.decrementCount(
      followingObjectId,
      "followersCount",
      dbSession
    )

    //commit transaction
    await dbSession.commitTransaction()
    return {
      status: HttpStatus.NO_CONTENT,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error creating Saved:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
