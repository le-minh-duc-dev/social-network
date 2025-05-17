import { FollowStatus, User } from "@/types/schema"

export class FollowAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/follows"

  static async getFollowStatus(
    followingId: string
  ): Promise<{ status: FollowStatus }> {
    const res = await fetch(
      this.baseUrl + "/status" + `?followingId=${followingId}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }

  static async getFollows(
    nextCursor: string,
    limit: number = 2,
    type: "followers" | "following" = "followers",
    isAccepted?: boolean
  ): Promise<InfiniteResponse<User>> {
    const res = await fetch(
      FollowAPI.baseUrl +
        `?nextCursor=${nextCursor}&limit=${limit}&type=${type}&isAccepted=${isAccepted}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
