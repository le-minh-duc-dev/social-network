"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { NotificationType } from "@/domain/enums/NotificationType"

import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { FollowService } from "@/service/FollowService"
import { NotificationService } from "@/service/NotificationService"
import { UserService } from "@/service/UserService"
import { Follow, Notification } from "@/types/schema"
import mongoose, { Types } from "mongoose"
export async function createFollow(
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

    const user = await userService.findUserById(followingObjectId)
    if (!user) {
      throw new Error("User not found")
    }

    const newFollow: Follow = await followService.createfollow(
      followerObjectId,
      followingObjectId,
      dbSession,
      user.isFollowApprovalRequired
    )

    if (!user.isFollowApprovalRequired) {
      await userService.incrementCount(
        followerObjectId,
        "followingCount",
        dbSession
      )
      await userService.incrementCount(
        followingObjectId,
        "followersCount",
        dbSession
      )
      await createFollowNotification(
        followerObjectId,
        followingObjectId,
        NotificationType.FOLLOW,
        newFollow._id as Types.ObjectId,
        dbSession
      )
    } else {
      await createFollowNotification(
        followerObjectId,
        followingObjectId,
        NotificationType.FOLLOW_REQUEST,
        newFollow._id as Types.ObjectId,
        dbSession
      )
    }

    //commit transaction
    await dbSession.commitTransaction()
    return {
      status: HttpStatus.CREATED,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error creating Saved:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}

async function createFollowNotification(
  senderObjectId: Types.ObjectId,
  recipientObjectId: Types.ObjectId,
  type: NotificationType.FOLLOW | NotificationType.FOLLOW_REQUEST,
  followObjectId: Types.ObjectId,
  dbSession: mongoose.ClientSession
) {
  const notificationService = new NotificationService()

  const notification: Notification = {
    sender: senderObjectId,
    recipient: recipientObjectId,
    type,
    follow: followObjectId,
  }

  await notificationService.createNotification(notification, dbSession)
}
