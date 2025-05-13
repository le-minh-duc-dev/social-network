"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import { Role } from "@/domain/enums/Role"

import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { UserService } from "@/service/UserService"
import mongoose from "mongoose"

import { User as UserType } from "@/types/schema"
import { EmailService } from "@/service/EmailService"
import AccountApprovedEmail from "@/email/AccountApprovedEmail"
import { after } from "next/server"
export async function toggleField(
  userId: string,
  field: keyof Pick<UserType, "isActive" | "isVerified">,
  status: boolean
): Promise<IResponse<string>> {
  await RouteProtector.protect(Role.ADMIN)

  let userObjectId
  try {
    userObjectId = MongooseHelper.toObjectId(userId)
  } catch (error) {
    console.error("Invalid userId:", userId, error)

    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }

  // services
  const userService = new UserService()
  ///

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    const isUpdated: boolean = await userService.toggleField(
      userObjectId,
      field,
      status,
      dbSession
    )
    if (!isUpdated) {
      HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
    }

    //commit transaction
    await dbSession.commitTransaction()
    after(async () => {
      if (status && field == "isActive") {
        const user = await userService.findUserById(userObjectId)
        console.log("Sending email...", user)
        await EmailService.send(
          AccountApprovedEmail({ name: user!.fullName }),
          [user!.email],
          "Your account has been approved!"
        )
      }
    })
    return {
      status: HttpStatus.NO_CONTENT,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error creating Like:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
