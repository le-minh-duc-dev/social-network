import { FollowStatus } from "@/types/schema"

export class FollowAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/follows"

  static async getFollowStatus(
    followingId: string
  ): Promise<{ status:FollowStatus }> {
    const res = await fetch(
      this.baseUrl + "/status" + `?followingId=${followingId}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
