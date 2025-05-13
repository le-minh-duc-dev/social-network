import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Comment from "@/domain/model/Comment"
import { CommentUploadType } from "@/domain/zod/CommentUploadSchema"
import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

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
          .populate("author", "_id fullName avatarUrl isVerified")
      },
      [UnstableCacheKey.POST_COMMENT_LIST + post + cursor + limit],
      {
        tags: [UnstableCacheKey.POST_COMMENT_LIST + post],
      }
    )()
  }
}
