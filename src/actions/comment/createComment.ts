"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import {
  CommentUploadSchema,
  CommentUploadType,
} from "@/domain/zod/CommentUploadSchema"
import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { CommentService } from "@/service/CommentService"
import { PostService } from "@/service/PostService"
import mongoose from "mongoose"
export async function createComment(
  postId: string,
  comment: CommentUploadType
): Promise<IResponse<string>> {
  await RouteProtector.protect()

  console.log("comment upload", comment)

  // services
  const commentService = new CommentService()
  const postService = new PostService()
  ///

  const result = CommentUploadSchema.safeParse(comment)
  if (!result.success) {
    console.error("Comment upload validation error:", result.error.flatten())
    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }
  //safe comment
  const safeComment = result.data

  //get user
  const user = await ServerSideAuthService.getAuthUser()

  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()
    const userObjectId = MongooseHelper.toObjectId(user!.id)
    const postObjectId = MongooseHelper.toObjectId(postId)
    await commentService.createComment(
      userObjectId,
      postObjectId,
      safeComment,
      dbSession
    )

    //increment comment count
    await postService.incrementCommentCount(postObjectId, dbSession)
    //commit transaction
    await dbSession.commitTransaction()
    return {
      status: HttpStatus.CREATED,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error creating comment:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
