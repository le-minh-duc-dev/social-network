import PostModel from "@/domain/model/Post"
import UserModel from "@/domain/model/User"
import { subDays, startOfDay } from "date-fns"

function getDate30DaysAgo() {
  return startOfDay(subDays(new Date(), 30))
}
export class AggregationService {
  async getDailyStats(): Promise<DailyStat[]> {
    const fromDate = getDate30DaysAgo()

    const postsPerDay = await PostModel.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const usersPerDay = await UserModel.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    const merged: Record<
      string,
      { date: string; posts: number; users: number }
    > = {}

    for (const p of postsPerDay) {
      merged[p._id] = { date: p._id, posts: p.count, users: 0 }
    }

    for (const u of usersPerDay) {
      if (merged[u._id]) {
        merged[u._id].users = u.count
      } else {
        merged[u._id] = { date: u._id, posts: 0, users: u.count }
      }
    }

    // Convert to sorted array (fill in empty days later if needed)
    return Object.values(merged).sort((a, b) => a.date.localeCompare(b.date))
  }
}
