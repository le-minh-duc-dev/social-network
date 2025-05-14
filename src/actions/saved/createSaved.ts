"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"

import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { SavedService } from "@/service/SavedService"
import mongoose from "mongoose"
export async function createSaved(postId: string): Promise<IResponse<string>> {
  await RouteProtector.protect()

  // services
  const savedService = new SavedService()
  ///

  //get user
  const user = await ServerSideAuthService.getAuthUser()

  let postObjectId
  let userObjectId
  try {
    postObjectId = MongooseHelper.toObjectId(postId)
    userObjectId = MongooseHelper.toObjectId(user!.id)
  } catch (error) {
    console.error("Invalid postId Or userId:", postId, user!.id, error)

    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    await savedService.createSaved(userObjectId, postObjectId, dbSession)

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
