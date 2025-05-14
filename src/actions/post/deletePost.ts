"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpMessages, HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { CloudinaryService } from "@/service/CloudinaryService"
import { PermissionService } from "@/service/PermissionService"
import { PostService } from "@/service/PostService"
import { UserService } from "@/service/UserService"
import { IMediaService } from "@/types/media_service"
import { User } from "@/types/schema"
import mongoose, { Types } from "mongoose"
export async function deletePost(postId: string): Promise<IResponse<string>> {
  await RouteProtector.protect()

  // services
  const mediaService: IMediaService = new CloudinaryService()
  const postService = new PostService()
  const userService = new UserService()

  //get user
  const user = await ServerSideAuthService.getAuthUser()

  let postObjectId
  try {
    postObjectId = MongooseHelper.toObjectId(postId)
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

    const post = await postService.getPostById(postObjectId)
    const author = post.author as User

    //get media urls
    const mediaUrls = post.media.map((m) => m.url)

    //check permission
    if (
      !PermissionService.hasDeletePostPermission(
        user!.id,
        user!.role,
        author._id.toString()
      )
    ) {
      return {
        status: HttpStatus.BAD_REQUEST,
        errors: [HttpMessages[HttpStatus.BAD_REQUEST]],
      }
    }

    //
    const isDeleted = await postService.deletePost(postObjectId)

    if (!isDeleted) {
      throw new Error("Something went wrong!")
    }

    await userService.decrementCount(
      new Types.ObjectId(author._id.toString()),
      "postsCount",
      dbSession
    )

    mediaService.deleteMediaByURLs(mediaUrls)
    await dbSession.commitTransaction()
    return {
      status: HttpStatus.NO_CONTENT,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error update post:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
