import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import UserModel from "@/domain/model/User"
import connectDB from "@/lib/connectDB"
import { User } from "@/types/schema"
import { FilterQuery, UpdateQuery } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

export class UserService {
  async findUserByEmail(email: string) {
    await connectDB()
    return unstable_cache(
      async (): Promise<User | null> => await UserModel.findOne({ email }),
      [UnstableCacheKey.USER_EMAIL + email],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  async existsByEmail(email: string) {
    await connectDB()
    return unstable_cache(
      async (): Promise<User | null> => await UserModel.findOne({ email }),
      [UnstableCacheKey.USER_EXISTS_BY_EMAIL + email],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )
  }

  async createUser(data: Partial<User>): Promise<User> {
    await connectDB()
    const user = new UserModel(data)
    const newUser = await user.save()
    revalidateTag(UnstableCacheKey.USER_LIST)
    return newUser
  }

  async updateUser(
    userId: string,
    updateData: UpdateQuery<User>
  ): Promise<User | null> {
    await connectDB()
    const savedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })
    revalidateTag(UnstableCacheKey.USER_LIST)
    return savedUser
  }

  async findUsers(filter: FilterQuery<User> = {}, limit = 10, skip = 0) {
    await connectDB()

    return unstable_cache(
      async (): Promise<User[]> =>
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

  async countUsers(filter: FilterQuery<User> = {}) {
    await connectDB()
     return unstable_cache(
      async (): Promise<number> =>
         await UserModel.countDocuments(filter),
      [UnstableCacheKey.USER_LIST_COUNT + filter.isVerified],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
    
  }
}
