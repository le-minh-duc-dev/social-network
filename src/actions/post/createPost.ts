"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import {  HttpStatus } from "@/domain/enums/HttpStatus"
import { PostUploadSchema, PostUploadType } from "@/domain/zod/PostUploadSchema"
import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { CloudinaryService } from "@/service/CloudinaryService"
import { PostService } from "@/service/PostService"
import { UserService } from "@/service/UserService"
import { IMediaService } from "@/types/media_service"
import mongoose from "mongoose"
export async function createPost(
  post: PostUploadType
): Promise<IResponse<string>> {
  await RouteProtector.protect()

  console.log("post upload", post)

  // services
  const mediaService: IMediaService = new CloudinaryService()
  const postService = new PostService()
  const userService = new UserService()
  ///

  const result = PostUploadSchema.safeParse(post)
  if (!result.success) {
    console.error("Post upload validation error:", result.error.flatten())
    mediaService.deleteMediaByURLs(post.media.map((item) => item.url))
    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }
  //safe post
  const safePost = result.data

  //get user
  const user = await ServerSideAuthService.getAuthUser()

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()
    const userObjectId = MongooseHelper.toObjectId(user!.id)
    const newPost = await postService.createPost(
      userObjectId,
      safePost,
      dbSession
    )

    await userService.incrementCount(userObjectId,"postsCount",dbSession)

    await dbSession.commitTransaction()
    return {
      status: HttpStatus.CREATED,
      data: "/posts/" + newPost._id,
      message: "Post created successfully",
    }
  } catch (error) {
    dbSession.abortTransaction()
    mediaService.deleteMediaByURLs(safePost.media.map((item) => item.url))
    console.error("Error creating post:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
