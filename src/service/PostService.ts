import { PostPrivacy } from "@/domain/enums/PostPrivacy"
import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Post from "@/domain/model/Post"
import { PostUploadType } from "@/domain/zod/PostUploadSchema"
import { Post as PostType } from "@/types/schema"
import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"
import { FollowService } from "./FollowService"

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
      privacy: post.privacy,
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
    authUserId: Types.ObjectId,
    authorObjectId?: Types.ObjectId,
    isExplore: boolean = false,
    isReels: boolean = false
  ) {
    return unstable_cache(
      async () => {
        const followService = new FollowService()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}
        if (cursor) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }

        // CASE 1: User profile
        if (authorObjectId) {
          query.author = authorObjectId
          query.$or = [{ privacy: PostPrivacy.PUBLIC }]
          if (authUserId?.toString() === authorObjectId.toString()) {
            query.$or.push({ privacy: PostPrivacy.PRIVATE })
            query.$or.push({ privacy: PostPrivacy.FOLLOWERS })
          } else {
            const followStatus =
              await followService.getFollowStateByFollowerAndFollowing(
                authUserId,
                authorObjectId
              )
            if (followStatus === "following") {
              query.$or.push({ privacy: PostPrivacy.FOLLOWERS })
            }
          }
          // Check if authUser is following the author
        }

        // CASE 2: Explore feed logic
        else if (isExplore) {
          const followingList =
            await followService.getFollowingIdList(authUserId)

          query.$or = [
            { privacy: PostPrivacy.PUBLIC },

            {
              privacy: PostPrivacy.FOLLOWERS,
              author: { $in: followingList },
            },
          ]
          // Exclude own posts
          query.author = { $ne: authUserId }
        } else if (isReels) {
          const followingList =
            await followService.getFollowingIdList(authUserId)

          query.$or = [
            { privacy: PostPrivacy.PUBLIC },

            {
              privacy: PostPrivacy.FOLLOWERS,
              author: { $in: followingList },
            },
          ]
        }

        // CASE 3: Home feed logic
        else {
          const followingList =
            await followService.getFollowingIdList(authUserId)

          query.$or = [
            { privacy: PostPrivacy.PUBLIC },
            {
              privacy: PostPrivacy.FOLLOWERS,
              author: { $in: followingList },
            },
            { author: authUserId },
          ]
        }

        return await Post.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
          .populate("author", "_id fullName avatarUrl isVerified")
      },
      [
        UnstableCacheKey.POST_LIST +
          cursor +
          limit +
          authorObjectId +
          authUserId +
          isExplore,
      ],
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
