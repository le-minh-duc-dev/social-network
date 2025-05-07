import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import User from "@/domain/model/User"
import connectDB from "@/lib/connectDB"
import { UserDoc } from "@/types/schema"
import { FilterQuery, UpdateQuery } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"

export class UserService {
  static async findUserByEmail(email: string) {
    await connectDB()
    return unstable_cache(
      async (): Promise<UserDoc | null> => await User.findOne({ email }),
      [UnstableCacheKey.USER_EMAIL + email],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )()
  }

  static async existsByEmail(email: string) {
    await connectDB()
    return unstable_cache(
      async (): Promise<UserDoc | null> => await User.findOne({ email }),
      [UnstableCacheKey.USER_EXISTS_BY_EMAIL + email],
      {
        tags: [UnstableCacheKey.USER_LIST],
      }
    )
  }

  static async createUser(data: Partial<UserDoc>): Promise<UserDoc> {
    await connectDB()
    const user = new User(data)
    const newUser = await user.save()
    revalidateTag(UnstableCacheKey.USER_LIST)
    return newUser
  }

  static async updateUser(
    userId: string,
    updateData: UpdateQuery<UserDoc>
  ): Promise<UserDoc | null> {
    await connectDB()
    const savedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })
    revalidateTag(UnstableCacheKey.USER_LIST)
    return savedUser
  }

  static async findUsers(
    filter: FilterQuery<UserDoc> = {},
    limit = 10,
    skip = 0
  ) {
    await connectDB()
    return await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  }
}
