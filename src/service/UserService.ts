import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import UserModel from "@/domain/model/User"
import connectDB from "@/lib/connectDB"
import { ClientSession, FilterQuery, Types, UpdateQuery } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

import { User as UserType } from "@/types/schema"

export class UserService {
  async getInfiniteUsers(cursor: string | null, limit: number) {
    return unstable_cache(
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {}
        if (cursor) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }

        return await UserModel.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
      },
      [UnstableCacheKey.USER_LIST + cursor + limit],
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

  async existsByEmail(email: string) {
    await connectDB()
    return unstable_cache(
      async (): Promise<UserType | null> => await UserModel.findOne({ email }),
      [UnstableCacheKey.USER_EXISTS_BY_EMAIL + email],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )
  }

  async createUser(data: Partial<UserType>): Promise<UserType> {
    await connectDB()
    const user = new UserModel(data)
    const newUser = await user.save()
    revalidateTag(UnstableCacheKey.USER_LIST)
    return newUser
  }

  async updateUser(
    userId: string,
    updateData: UpdateQuery<UserType>
  ): Promise<UserType | null> {
    await connectDB()
    const savedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })
    revalidateTag(UnstableCacheKey.USER_LIST)
    return savedUser
  }

  async findUsers(filter: FilterQuery<UserType> = {}, limit = 10, skip = 0) {
    await connectDB()

    return unstable_cache(
      async (): Promise<UserType[]> =>
        await UserModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
      [UnstableCacheKey.USER_LIST],
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

    return result.modifiedCount > 0
  }
}
