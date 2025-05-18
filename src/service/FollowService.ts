import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Follow from "@/domain/model/Follow"

import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"
import { Follow as FollowType, FollowStatus } from "@/types/schema"

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
    revalidateTag(UnstableCacheKey.USER_FOLLOW + following)
    revalidateTag(UnstableCacheKey.POST_LIST)
    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + follower)
    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + following)

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
    revalidateTag(UnstableCacheKey.USER_FOLLOW + following)
    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + follower)
    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + following)
    revalidateTag(UnstableCacheKey.POST_LIST)

    return result.deletedCount > 0
  }

  async getInfiniteFollows(
    userObjectId: Types.ObjectId,
    cursor: string | null,
    limit: number,
    type: "followers" | "following",
    isAccepted?: boolean
  ) {
    return unstable_cache(
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}
        if (cursor && Types.ObjectId.isValid(cursor)) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }

        if (type == "followers") {
          query.following = userObjectId
        }

        if (type == "following") {
          query.follower = userObjectId
        }

        if (isAccepted !== undefined) {
          query.isAccepted = isAccepted
        }

        return await Follow.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
          .populate(
            type == "followers" ? "follower" : "following",
            "_id fullName avatarUrl isVerified username"
          )
      },
      [
        UnstableCacheKey.USER_FOLLOW +
          userObjectId +
          cursor +
          limit +
          type +
          isAccepted,
      ],
      {
        tags: [
          UnstableCacheKey.USER_FOLLOW + userObjectId,
          UnstableCacheKey.USER_LIST,
        ],
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
        tags: [
          UnstableCacheKey.USER_FOLLOW + follower,
          UnstableCacheKey.USER_LIST,
        ],
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
        tags: [
          UnstableCacheKey.USER_FOLLOW + follower,
          UnstableCacheKey.USER_LIST,
        ],
      }
    )()
  }

  async toggleField(
    authUserObjectId: Types.ObjectId,
    userObjectId: Types.ObjectId,
    field: keyof Pick<FollowType, "isAccepted">,
    status: boolean,
    session?: ClientSession
  ) {
    const result = await Follow.updateOne(
      { follower: userObjectId, following: authUserObjectId },
      { $set: { [field]: status } },
      { session }
    )
    revalidateTag(UnstableCacheKey.USER_LIST)
    revalidateTag(UnstableCacheKey.POST_LIST)
    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + userObjectId)
    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + authUserObjectId)

    return result.modifiedCount > 0
  }
}
