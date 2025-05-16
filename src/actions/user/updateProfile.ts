"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import {
  EditProfileSchema,
  EditProfileType,
} from "@/domain/zod/EditProfileSchema"
import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { CloudinaryService } from "@/service/CloudinaryService"
import { UserService } from "@/service/UserService"
import { IMediaService } from "@/types/media_service"
import mongoose from "mongoose"
export async function updateProfile(
  profileData: EditProfileType,
  hasNewAvatar: boolean
): Promise<IResponse<string>> {
  await RouteProtector.protect()

  console.log("profile upload", profileData)

  // services
  const mediaService: IMediaService = new CloudinaryService()
  const userService = new UserService()
  ///

  const result = EditProfileSchema.safeParse(profileData)
  if (!result.success) {
    console.error("Post upload validation error:", result.error.flatten())
    if (hasNewAvatar) {
      mediaService.deleteMediaByURLs([profileData.avatarUrl!])
    }
    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }
  //safe post
  const safeProfileData = result.data

  //get user
  const user = await ServerSideAuthService.getAuthUser()

  try {
    MongooseHelper.toObjectId(user!.id)
  } catch (error) {
    console.error("Invalid postId Or userId:", user?.id, error)

    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    const isUpdated = await userService.updateUser(
      user!.id,
      safeProfileData,
      dbSession
    )
    if (!isUpdated) {
      throw new Error("Unthorized actions: User does not own the post!")
    }
    if (hasNewAvatar && CloudinaryService.isCloudinaryUrl(user!.avatarUrl!)) {
      mediaService.deleteMediaByURLs([user!.avatarUrl!])
    }
    await dbSession.commitTransaction()
    return {
      status: HttpStatus.NO_CONTENT,
      message: "Post updated successfully",
    }
  } catch (error) {
    dbSession.abortTransaction()
    if (hasNewAvatar) {
      mediaService.deleteMediaByURLs([profileData.avatarUrl!])
    }
    console.error("Error update post:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
