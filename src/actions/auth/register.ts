"use server"

import { HttpStatus } from "@/domain/enums/HttpStatus"
import { Role } from "@/domain/enums/Role"
import {
  RegisterUploadSchema,
  RegisterUploadType,
} from "@/domain/zod/RegisterSchema"
import { AuthHelper } from "@/lib/AuthHelper"

import connectDB from "@/lib/connectDB"
import { Formater } from "@/lib/Formater"
import { HttpHelper } from "@/lib/HttpHelper"
import { PasswordEncoder } from "@/lib/PasswordEncoder"
import { NotificationService } from "@/service/NotificationService"
import { UserService } from "@/service/UserService"
import { Notification } from "@/types/schema"
import mongoose from "mongoose"
export async function register(
  formData: RegisterUploadType
): Promise<IResponse<string>> {
  const safeFormData = RegisterUploadSchema.safeParse(formData)
  if (!safeFormData.success) {
    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }
  const { email, password, fullName } = safeFormData.data
  const normalizedFullName = Formater.normalizeVietnamese(fullName)
  const username = AuthHelper.generateUsername(normalizedFullName)
  // services

  const userService = new UserService()
  const notificationService = new NotificationService()

  ///

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    const exists = await userService.existsByEmail(email)
    if (exists) {
      return HttpHelper.buildHttpErrorResponseData(
        HttpStatus.BAD_REQUEST,
        "Email already exists"
      )
    }
    const hashedPassword = await PasswordEncoder.encodePassword(password)
    const newUser = await userService.createUser(
      {
        email,
        password: hashedPassword,
        fullName,
        normalizedFullName,
        username,
      },
      dbSession
    )

    const notification: Notification = {
      sender: newUser._id,
      recipient: "",
      type: "NEW_USER_JOINED",
    }

    await notificationService.sendNotificationToRole(
      Role.ADMIN,
      notification,
      dbSession
    )

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
