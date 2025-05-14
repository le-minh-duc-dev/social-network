import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Follow from "@/domain/model/Follow"

import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

export class FollowService {
  async createfollow(
    follower: Types.ObjectId,
    following: Types.ObjectId,
    dbSession: ClientSession
  ) {
    const newfollow = new Follow({
      follower,
      following,
    })
    const savedNewfollow = await newfollow.save({ session: dbSession })

    revalidateTag(UnstableCacheKey.USER_FOLLOW + follower)

    return savedNewfollow
  }

  async deletefollow(
    follower: Types.ObjectId,
    following: Types.ObjectId,
    dbSession: ClientSession
  ) {
    const result = await Follow.deleteOne(
      {
        follower,
        following,
      },
      { session: dbSession }
    )

    revalidateTag(UnstableCacheKey.USER_FOLLOW + follower)

    return result.deletedCount > 0
  }

  async getInfiniteFollows(
    userObjectId: Types.ObjectId,
    cursor: string | null,
    limit: number
  ) {
    return unstable_cache(
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {
          follower: userObjectId,
        }
        if (cursor) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }

        return await Follow.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
          .populate("following", "_id fullName avatarUrl isVerified")
      },
      [UnstableCacheKey.USER_FOLLOW + userObjectId + cursor + limit],
      {
        tags: [UnstableCacheKey.USER_FOLLOW + userObjectId],
      }
    )()
  }

  async existsFollowByFollowerAndFollowing(
    follower: Types.ObjectId,
    following: Types.ObjectId
  ) {
    return unstable_cache(
      async () => {
        const query = {
          follower,
          following,
        }

        return await Follow.exists(query)
      },
      [UnstableCacheKey.USER_FOLLOW + "EXISTS" + follower + following],
      {
        tags: [UnstableCacheKey.USER_FOLLOW + follower],
      }
    )()
  }
}
