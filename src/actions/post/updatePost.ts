"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { PostUploadSchema, PostUploadType } from "@/domain/zod/PostUploadSchema"
import connectDB from "@/lib/connectDB"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { CloudinaryService } from "@/service/CloudinaryService"
import { PostService } from "@/service/PostService"
import { IMediaService } from "@/types/media_service"
import mongoose from "mongoose"
export async function updatePost(
  postId: string,
  post: PostUploadType,
  deletedMediaUrls: string[]
): Promise<IResponse<string>> {
  await RouteProtector.protect()

  console.log("post upload", post)

  // services
  const mediaService: IMediaService = new CloudinaryService()
  const postService = new PostService()
  ///

  const result = PostUploadSchema.safeParse(post)
  if (!result.success) {
    console.error("Post upload validation error:", result.error.flatten())
    mediaService.deleteMediaByURLs(post.media.map((item) => item.url))
    return {
      status: 400,
      message: "Invalid post data",
      data: "",
    }
  }
  //safe post
  const safePost = result.data

  //get user
  const user = await ServerSideAuthService.getAuthUser()

  let postObjectId
  let userObjectId
  try {
    postObjectId = MongooseHelper.toObjectId(postId)
    userObjectId = MongooseHelper.toObjectId(user!.id)
  } catch (error) {
    console.error("Invalid postId Or userId:", postId, user!.id, error)

    return {
      status: 400,
      message: "Failed to update post",
    }
  }

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    const isUpdated = await postService.updatePost(
      userObjectId,
      postObjectId,
      safePost,
      dbSession
    )
    if (!isUpdated) {
      throw new Error("Unthorized actions: User does not own the post!")
    }
    mediaService.deleteMediaByURLs(deletedMediaUrls)
    await dbSession.commitTransaction()
    return {
      status: 200,
      message: "Post updated successfully",
    }
  } catch (error) {
    dbSession.abortTransaction()
    mediaService.deleteMediaByURLs(safePost.media.map((item) => item.url))
    console.error("Error update post:", error)
  }
  return { status: 500, message: "Failed to update post" }
}
