"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { HttpStatus } from "@/domain/enums/HttpStatus"

import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"

import mongoose, { Types } from "mongoose"

import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { FollowService } from "@/service/FollowService"
import { UserService } from "@/service/UserService"
export async function toggleFollowAccept(
  userId: string,
  status: boolean
): Promise<IResponse<string>> {
  await RouteProtector.protect()

  let userObjectId
  try {
    userObjectId = MongooseHelper.toObjectId(userId)
  } catch (error) {
    console.error("Invalid userId:", userId, error)

    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }

  const authUser = await ServerSideAuthService.getAuthUser()

  // services
  const followService = new FollowService()
  const userService = new UserService()

  ///

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    const isUpdated: boolean = await followService.toggleField(
      new Types.ObjectId(authUser!.id),
      userObjectId,
      "isAccepted",
      status,
      dbSession
    )
    if (!isUpdated) {
      HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (status) {
      await userService.incrementCount(
        userObjectId,
        "followingCount",
        dbSession
      )
      await userService.incrementCount(
        new Types.ObjectId(authUser!.id),
        "followersCount",
        dbSession
      )
    } else {
      await userService.decrementCount(
        userObjectId,
        "followingCount",
        dbSession
      )
      await userService.decrementCount(
        new Types.ObjectId(authUser!.id),
        "followersCount",
        dbSession
      )
    }

    //commit transaction
    await dbSession.commitTransaction()

    return {
      status: HttpStatus.NO_CONTENT,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error toggle follow isAccepted :", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
