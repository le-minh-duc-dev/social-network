"use server"

import { RouteProtector } from "@/auth/RouteProtector"
import { ServerSideAuthService } from "@/auth/ServerSideAuthService"
import { HttpStatus } from "@/domain/enums/HttpStatus"
import connectDB from "@/lib/connectDB"
import { HttpHelper } from "@/lib/HttpHelper"
import { MongooseHelper } from "@/lib/MongooseHelper"
import { CommentService } from "@/service/CommentService"
import { PermissionService } from "@/service/PermissionService"
import { PostService } from "@/service/PostService"
import { User } from "@/types/schema"
import mongoose, { Types } from "mongoose"
export async function deleteComment(
  commentId: string
): Promise<IResponse<string>> {
  await RouteProtector.protect()

  // services
  const commentService = new CommentService()
  const postService = new PostService()

  //get user
  const user = await ServerSideAuthService.getAuthUser()

  let commentObjectId
  try {
    commentObjectId = MongooseHelper.toObjectId(commentId)
  } catch (error) {
    console.error("Invalid commentId Or userId:", commentId, error)

    return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
  }


  console.log(commentObjectId);
  //get db session
  await connectDB()
  const dbSession = await mongoose.startSession()
  //
  try {
    dbSession.startTransaction()

    const comment = await commentService.getCommentById(commentObjectId)
    console.log("comment", comment);
    if (!comment) {
      return HttpHelper.buildHttpErrorResponseData(HttpStatus.NOT_FOUND)
    }
    const author = comment.author as User

    //check permission
    if (
      !PermissionService.hasDeleteCommentPermission(
        user!.id,
        user!.role,
        author._id.toString()
      )
    ) {
      return HttpHelper.buildHttpErrorResponseData(HttpStatus.BAD_REQUEST)
    }

    //
    const isDeleted = await commentService.deleteCommentById(
      commentObjectId,
      dbSession
    )

    if (!isDeleted) {
      throw new Error("Something went wrong!")
    }

    await postService.decrementCommentCount(
      comment.post as Types.ObjectId,
      dbSession
    )

    await dbSession.commitTransaction()
    return {
      status: HttpStatus.NO_CONTENT,
    }
  } catch (error) {
    dbSession.abortTransaction()
    console.error("Error delete comment:", error)
  }
  return HttpHelper.buildHttpErrorResponseData(HttpStatus.INTERNAL_SERVER_ERROR)
}
