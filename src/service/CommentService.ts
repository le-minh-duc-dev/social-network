import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Comment from "@/domain/model/Comment"
import { CommentUploadType } from "@/domain/zod/CommentUploadSchema"
import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"
import { Comment as CommentType } from "@/types/schema"
export class CommentService {
  async createComment(
    user: Types.ObjectId,
    post: Types.ObjectId,
    comment: CommentUploadType,
    dbSession: ClientSession
  ) {
    const newComment = new Comment({
      author: user,
      post,
      content: comment.content,
    })
    const savedComment = await newComment.save({ session: dbSession })

    revalidateTag(UnstableCacheKey.POST_COMMENT_LIST + post)

    return savedComment
  }

  async getInfiniteComments(
    post: Types.ObjectId,
    cursor: string | null,
    limit: number
  ) {
    return unstable_cache(
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {
          post: post,
        }
        if (cursor) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }

        return await Comment.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
          .populate("author", "_id fullName avatarUrl isVerified username")
      },
      [UnstableCacheKey.POST_COMMENT_LIST + post + cursor + limit],
      {
        tags: [
          UnstableCacheKey.POST_COMMENT_LIST + post,
          UnstableCacheKey.POST_COMMENT_LIST,
        ],
      }
    )()
  }

  async getCommentById(commentId: Types.ObjectId) : Promise<CommentType | null> {
    return unstable_cache(
      async () => {
        return await Comment.findById(commentId).populate(
          "author",
          "_id fullName avatarUrl isVerified username"
        )
      },
      [UnstableCacheKey.POST_COMMENT_LIST + commentId],
      {
        tags: [
          UnstableCacheKey.POST_COMMENT_LIST + commentId,
          UnstableCacheKey.POST_COMMENT_LIST,
        ],
      }
    )()
  }

  async deleteCommentById(commentId: Types.ObjectId, dbSession: ClientSession) {
    const result = await Comment.deleteOne(
      { _id: commentId },
      { session: dbSession }
    )

    revalidateTag(UnstableCacheKey.POST_COMMENT_LIST + commentId)
    revalidateTag(UnstableCacheKey.POST_COMMENT_LIST)

    return result.deletedCount > 0
  }
}
