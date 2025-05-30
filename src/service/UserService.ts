import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import UserModel from "@/domain/model/User"
import connectDB from "@/lib/connectDB"
import { ClientSession, FilterQuery, Types, UpdateQuery } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

import { UserCountableField, User as UserType } from "@/types/schema"
import { MongooseHelper } from "@/lib/MongooseHelper"

export class UserService {
  async getInfiniteUsers(
    cursor: string | null,
    limit: number,
    searchKey: string | null
  ) {
    return unstable_cache(
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}
        if (cursor) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }

        if (searchKey) {
          query.$or = [
            { username: { $regex: searchKey, $options: "i" } },
            { normalizedFullName: { $regex: searchKey, $options: "i" } },
          ]
        }

        return await UserModel.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
      },
      [UnstableCacheKey.USER_LIST + cursor + limit, "SEARCH", searchKey ?? ""],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  async findUserByEmail(email: string) {
    await connectDB()
    return unstable_cache(
      async (): Promise<UserType | null> => await UserModel.findOne({ email }),
      [UnstableCacheKey.USER_EMAIL + email],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  async findUserById(userObjectId: Types.ObjectId) {
    await connectDB()
    return unstable_cache(
      async (): Promise<UserType | null> =>
        await UserModel.findOne({ _id: userObjectId }),
      [UnstableCacheKey.USER_LIST + userObjectId.toString()],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  async deleteUserById(
    userObjectId: Types.ObjectId,
    session?: ClientSession
  ): Promise<boolean> {
    await connectDB()
    const result = await UserModel.deleteOne({ _id: userObjectId }, { session })
    return result.deletedCount > 0
  }

  async existsByEmail(email: string) {
    await connectDB()
    return unstable_cache(
      async (): Promise<boolean> => (await UserModel.exists({ email })) != null,
      [UnstableCacheKey.USER_EXISTS_BY_EMAIL + email],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  async existsBy(field: "username" | "email", value: string) {
    await connectDB()
    return unstable_cache(
      async (): Promise<boolean> => {
        console.log("UserService.existsBy-------", field, value)
        const result = await UserModel.exists({ [field]: value })
        return result != null
      },
      [UnstableCacheKey.USER_EXISTS_BY + field + value],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  async createUser(
    data: Partial<UserType>,
    session?: ClientSession
  ): Promise<UserType> {
    const user = new UserModel(data)
    const newUser = await user.save({ session })
    revalidateTag(UnstableCacheKey.USER_LIST)
    return newUser
  }

  async updateUser(
    userId: string,
    updateData: UpdateQuery<UserType>,
    session?: ClientSession
  ): Promise<UserType | null> {
    await connectDB()
    const savedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      session,
    })
    revalidateTag(UnstableCacheKey.USER_LIST)
    return savedUser
  }

  async findAllUserIds(filter: FilterQuery<UserType> = {}) {
    const cacheKey = MongooseHelper.buildCacheKey<UserType>(
      "USER_LIST_",
      filter
    )
    return unstable_cache(
      async (): Promise<Types.ObjectId[]> => {
        const users = await UserModel.find(filter).select("_id")
        return users.map((user) => user._id)
      },
      [cacheKey],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  async countUsers(filter: FilterQuery<UserType> = {}) {
    await connectDB()
    return unstable_cache(
      async (): Promise<number> => await UserModel.countDocuments(filter),
      [UnstableCacheKey.USER_LIST_COUNT + filter.isVerified],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  async toggleField(
    userObjectId: Types.ObjectId,
    field: keyof Pick<UserType, "isActive" | "isVerified">,
    status: boolean,
    session?: ClientSession
  ) {
    const result = await UserModel.updateOne(
      { _id: userObjectId },
      { $set: { [field]: status } }, // ✅ computed property
      { session }
    )
    revalidateTag(UnstableCacheKey.USER_LIST)
    revalidateTag(UnstableCacheKey.POST_LIST)

    return result.modifiedCount > 0
  }

  async incrementCount(
    userId: Types.ObjectId,
    field: UserCountableField,
    session?: ClientSession
  ) {
    await UserModel.updateOne(
      { _id: userId },
      { $inc: { [field]: 1 } },
      { session }
    )
    revalidateTag(UnstableCacheKey.USER_LIST)
    revalidateTag(UnstableCacheKey.USER_LIST + userId.toString())
  }

  async decrementCount(
    userId: Types.ObjectId,
    field: UserCountableField,
    session?: ClientSession
  ) {
    await UserModel.updateOne(
      { _id: userId },
      { $inc: { [field]: -1 } },
      { session }
    )
    revalidateTag(UnstableCacheKey.USER_LIST)
    revalidateTag(UnstableCacheKey.USER_LIST + userId.toString())
  }
}
