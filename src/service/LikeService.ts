import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Like from "@/domain/model/Like"
import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

export class LikeService {
  async createLike(
    user: Types.ObjectId,
    post: Types.ObjectId,
    dbSession: ClientSession
  ) {
    const newLike = new Like({
      user,
      post,
    })
    const savedLike = await newLike.save({ session: dbSession })

    revalidateTag(UnstableCacheKey.POST_LIKE_LIST + post)

    return savedLike
  }

  async deleteLike(
    user: Types.ObjectId,
    post: Types.ObjectId,
    dbSession: ClientSession
  ) {
    const deletedLike = await Like.deleteOne(
      {
        user,
        post,
      },
      { session: dbSession }
    )

    revalidateTag(UnstableCacheKey.POST_LIKE_LIST + post)

    return deletedLike.deletedCount > 0
  }

  async getInfiniteLikes(
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

        return await Like.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
          .populate("user", "_id fullName avatarUrl")
      },
      [UnstableCacheKey.POST_LIKE_LIST + post + cursor + limit],
      {
        tags: [UnstableCacheKey.POST_LIKE_LIST + post],
      }
    )()
  }

  async existsLikeByUserAndPostId(
    user: Types.ObjectId,
    post: Types.ObjectId,
    
  ) {
    return unstable_cache(
      async () => {
        const query = {
          post: post,
          user: user,
        }
       

        return await Like.exists(query)
          
      },
      [UnstableCacheKey.POST_LIKE_EXISTS + user + post],
      {
        tags: [UnstableCacheKey.POST_LIKE_LIST + post],
      }
    )()
  }
}
