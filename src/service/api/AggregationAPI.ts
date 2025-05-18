export class AggregationAPI {
  static readonly baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL + "/api/aggregation"

  static async getDailyStats(): Promise<DailyStat[]> {
    const res = await fetch(this.baseUrl + "/post-user-trend", {
      credentials: "include",
    })

    return await res.json()
  }
}
