import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Post from "@/domain/model/Post"
import { PostUploadType } from "@/domain/zod/PostUploadSchema"
import { Post as PostType } from "@/types/schema"
import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

export class PostService {
  async createPost(
    user: Types.ObjectId,
    post: PostUploadType,
    dbSession: ClientSession
  ) {
    const newPost = new Post({
      author: user,
      caption: post.caption,
      media: post.media,
    })
    const savedPost = await newPost.save({ session: dbSession })

    //revalidateTag(UnstableCacheKey.POST_LIST)
    revalidateTag(UnstableCacheKey.POST_LIST)

    return savedPost
  }

  async incrementCommentCount(postId: Types.ObjectId, session?: ClientSession) {
    await Post.updateOne(
      { _id: postId },
      { $inc: { commentCount: 1 } },
      { session }
    )
    revalidateTag(UnstableCacheKey.POST_LIST)
    revalidateTag(UnstableCacheKey.POST_SINGLE + postId.toString())
  }

  async decrementCommentCount(postId: Types.ObjectId, session?: ClientSession) {
    await Post.updateOne(
      { _id: postId },
      { $inc: { commentCount: -1 } },
      { session }
    )
    revalidateTag(UnstableCacheKey.POST_LIST)
    revalidateTag(UnstableCacheKey.POST_SINGLE + postId.toString())
  }

  async incrementLikeCount(postId: Types.ObjectId, session?: ClientSession) {
    await Post.updateOne(
      { _id: postId },
      { $inc: { likeCount: 1 } },
      { session }
    )
    revalidateTag(UnstableCacheKey.POST_LIST)
    revalidateTag(UnstableCacheKey.POST_SINGLE + postId.toString())
  }

  async decrementLikeCount(postId: Types.ObjectId, session?: ClientSession) {
    await Post.updateOne(
      { _id: postId },
      { $inc: { likeCount: -1 } },
      { session }
    )
    revalidateTag(UnstableCacheKey.POST_LIST)
    revalidateTag(UnstableCacheKey.POST_SINGLE + postId.toString())
  }

  async getInfinitePosts(
    cursor: string | null,
    limit: number,
    authorObjectId?: Types.ObjectId
  ) {
    return unstable_cache(
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}
        if (cursor) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }
        if (authorObjectId) {
          query.author = authorObjectId
        }

        return await Post.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
          .populate("author", "_id fullName avatarUrl isVerified")
      },
      [UnstableCacheKey.POST_LIST + cursor + limit],
      {
        tags: [UnstableCacheKey.POST_LIST],
      }
    )()
  }

  async getPostById(id: Types.ObjectId) {
    return unstable_cache(
      async (): Promise<PostType> => {
        return await Post.findById(id).populate(
          "author",
          "_id fullName avatarUrl"
        )
      },
      [UnstableCacheKey.POST_LIST + id.toString()],
      {
        tags: [UnstableCacheKey.POST_LIST],
      }
    )()
  }

  async updatePost(
    userId: Types.ObjectId,
    postId: Types.ObjectId,
    postData: PostUploadType,
    dbSession: ClientSession
  ) {
    const savedPost = await Post.updateOne(
      { _id: postId, author: userId },
      {
        ...postData,
      },
      { session: dbSession }
    )

    revalidateTag(UnstableCacheKey.POST_LIST)

    return savedPost.modifiedCount > 0
  }

  async deletePost(postId: Types.ObjectId) {
    const result = await Post.deleteOne({ _id: postId })

    revalidateTag(UnstableCacheKey.POST_LIST)
    return result.deletedCount > 0
  }
}
