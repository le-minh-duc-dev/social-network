import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Saved from "@/domain/model/Saved"
import { ClientSession, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

export class SavedService {
  async createSaved(
    user: Types.ObjectId,
    post: Types.ObjectId,
    dbSession: ClientSession
  ) {
    const newSaved = new Saved({
      user,
      post,
    })
    const savednewSaved = await newSaved.save({ session: dbSession })

    revalidateTag(UnstableCacheKey.USER_SAVED + user)

    return savednewSaved
  }

  async deleteSaved(
    user: Types.ObjectId,
    post: Types.ObjectId,
    dbSession: ClientSession
  ) {
    const result = await Saved.deleteOne(
      {
        user,
        post,
      },
      { session: dbSession }
    )

    revalidateTag(UnstableCacheKey.USER_SAVED + user)

    return result.deletedCount > 0
  }

  async getInfiniteSaveds(
    userObjectId: Types.ObjectId,
    cursor: string | null,
    limit: number
  ) {
    return unstable_cache(
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {
          user: userObjectId,
        }
        if (cursor) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }

        return await Saved.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
          .populate({
            path: "post",
            populate: {
              path: "author",
              model: "User", 
              select: "_id fullName avatarUrl isVerified", 
            },
          })
      },
      [UnstableCacheKey.USER_SAVED + userObjectId + cursor + limit],
      {
        tags: [UnstableCacheKey.USER_SAVED + userObjectId],
      }
    )()
  }

  async existsSavedByUserAndPostId(user: Types.ObjectId, post: Types.ObjectId) {
    return unstable_cache(
      async () => {
        const query = {
          post: post,
          user: user,
        }

        return await Saved.exists(query)
      },
      [UnstableCacheKey.USER_SAVED + user + post],
      {
        tags: [UnstableCacheKey.USER_SAVED + user],
      }
    )()
  }
}
