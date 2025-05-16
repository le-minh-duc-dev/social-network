"use server"

import { HttpStatus } from "@/domain/enums/HttpStatus"
import {
  RegisterUploadSchema,
  RegisterUploadType,
} from "@/domain/zod/RegisterSchema"

import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { UserService } from "@/service/UserService"
import mongoose from "mongoose"
export async function register(
  formData: RegisterUploadType
): Promise<IResponse<string>> {
  const safeFormData = RegisterUploadSchema.safeParse(formData)
  if (!safeFormData.success) {
    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }
  const { email, password, fullName } = safeFormData.data

  // services

  const userService = new UserService()

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
    await userService.createUser(
      {
        email,
        password,
        fullName,
      },
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
