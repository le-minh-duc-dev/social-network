export class FollowAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/follows"

  static async checkFollowExists(
    followingId: string
  ): Promise<{ exists: boolean }> {
    const res = await fetch(
      this.baseUrl + "/exists" + `?followingId=${followingId}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
