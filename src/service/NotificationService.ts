import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import Notification from "@/domain/model/Notification"
import { Notification as NotificationType } from "@/types/schema"
import { ClientSession, FilterQuery, Types } from "mongoose"
import { revalidateTag, unstable_cache } from "next/cache"
import { UserService } from "./UserService"
import { Role } from "@/domain/enums/Role"
import { MongooseHelper } from "@/lib/MongooseHelper"

export class NotificationService {
  async createNotification(
    notification: NotificationType,
    session: ClientSession
  ) {
    const newNotification = new Notification({
      ...notification,
    })
    const NotificationnewNotification = await newNotification.save({
      session,
    })

    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + notification.recipient)

    return NotificationnewNotification
  }

  async deleteNotification(
    user: Types.ObjectId,
    notificationId: Types.ObjectId,
    dbSession: ClientSession
  ) {
    const result = await Notification.deleteOne(
      {
        repcipient: user,
        _id: notificationId,
      },
      { session: dbSession }
    )

    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + user)

    return result.deletedCount > 0
  }

  async getInfiniteNotifications(
    userObjectId: Types.ObjectId,
    cursor: string | null,
    limit: number
  ) {
    return unstable_cache(
      async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {
          recipient: userObjectId,
        }
        if (cursor) {
          query._id = { $lt: new Types.ObjectId(cursor) }
        }

        return await Notification.find(query)
          .sort({ _id: -1 }) // newest first
          .limit(limit + 1)
          .populate(
            "sender",
            "_id fullName avatarUrl isVerified username isActive"
          )
          .populate("like")
          .populate("follow")
          .populate("comment")
      },
      [UnstableCacheKey.NOTIFICATION_LIST + userObjectId + cursor + limit],
      {
        tags: [
          UnstableCacheKey.NOTIFICATION_LIST + userObjectId,
          UnstableCacheKey.USER_LIST,
        ],
      }
    )()
  }

  async sendNotificationToRole(
    role: Role,
    notification: NotificationType,
    session: ClientSession
  ) {
    const userService = new UserService()
    const userIds = await userService.findAllUserIds({ role })
    console.log("User IDs:", userIds)

    if (userIds.length === 0) return

    const notifications = userIds.map((userId) => ({
      ...notification,
      recipient: userId,
    }))

    await Notification.insertMany(notifications, { session })
    userIds.forEach((userId) => {
      revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + userId)
    })
  }

  async getNotificationCount(filter: FilterQuery<NotificationType> = {}) {
    const cacheKey = MongooseHelper.buildCacheKey<NotificationType>(
      UnstableCacheKey.NOTIFICATION_LIST + "_",
      filter
    )
    return unstable_cache(
      async () => {
        return await Notification.countDocuments(filter)
      },
      [cacheKey],
      {
        tags: [
          UnstableCacheKey.NOTIFICATION_LIST + filter.recipient,
          UnstableCacheKey.USER_LIST,
        ],
      }
    )()
  }

  async toggleField(
    authUserObjectId: Types.ObjectId,
    notificationObjectId: Types.ObjectId,
    field: keyof Pick<NotificationType, "isRead">,
    status: boolean,
    session?: ClientSession
  ) {
    const result = await Notification.updateOne(
      { _id: notificationObjectId },
      { $set: { [field]: status } },
      { session }
    )
    revalidateTag(UnstableCacheKey.NOTIFICATION_LIST + authUserObjectId)
    return result.modifiedCount > 0
  }
}
