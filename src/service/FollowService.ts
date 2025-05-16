import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Follow from "@/domain/model/Follow"

import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"
import { FollowStatus } from "@/types/schema"

export class FollowService {
  async createfollow(
    follower: Types.ObjectId,
    following: Types.ObjectId,
    dbSession: ClientSession,
    isFollowApprovalRequired?: boolean
  ) {
    const newfollow = new Follow({
      follower,
      following,
      isAccepted: !isFollowApprovalRequired,
    })
    const savedNewfollow = await newfollow.save({ session: dbSession })

    revalidateTag(UnstableCacheKey.USER_FOLLOW + follower)
    revalidateTag(UnstableCacheKey.POST_LIST)

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
    revalidateTag(UnstableCacheKey.POST_LIST)

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

  async getFollowStateByFollowerAndFollowing(
    follower: Types.ObjectId,
    following: Types.ObjectId
  ): Promise<FollowStatus> {
    return unstable_cache(
      async () => {
        const query = {
          follower,
          following,
        }

        const follow = await Follow.findOne(query)
        if (!follow) {
          return "notFollowing"
        }
        if (follow.isAccepted) {
          return "following"
        } else {
          return "requesting"
        }
      },
      [UnstableCacheKey.USER_FOLLOW + "EXISTS" + follower + following],
      {
        tags: [UnstableCacheKey.USER_FOLLOW + follower],
      }
    )()
  }

  async getFollowingIdList(
    follower: Types.ObjectId,
    isAccepted: boolean = true
  ) {
    return unstable_cache(
      async () => {
        return await Follow.find({
          follower: follower,
          isAccepted,
        }).distinct("following")
      },
      [UnstableCacheKey.USER_FOLLOW + "FOLLOWING_ID_LIST" + follower],
      {
        tags: [UnstableCacheKey.USER_FOLLOW + follower],
      }
    )()
  }
}
