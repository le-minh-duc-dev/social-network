"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { HttpStatus } from "@/domain/enums/HttpStatus"

import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"

import mongoose, { Types } from "mongoose"

import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { NotificationService } from "@/service/NotificationService"
export async function toggleIsRead(
  notificationId: string,
  status: boolean
): Promise<IResponse<string>> {
  await RouteProtector.protect()

  let notificationObjectId
  try {
    notificationObjectId = MongooseHelper.toObjectId(notificationId)
  } catch (error) {
    console.error("Invalid notificationId:", notificationId, error)

    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }

  const authUser = await ServerSideAuthService.getAuthUser()

  // services
  const notificationService = new NotificationService()

  ///

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    const isUpdated: boolean = await notificationService.toggleField(
      new Types.ObjectId(authUser!.id),
      notificationObjectId,
      "isRead",
      status,
      dbSession
    )
    if (!isUpdated) {
      HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
    }

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
