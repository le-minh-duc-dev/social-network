export class UserAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/users"

  static async getTotalUsers(): Promise<CountResponse> {
    const res = await fetch(UserAPI.baseUrl + `/count`, {
      credentials: "include",
    })
    return await res.json()
  }

  static async getVerifiedUsers(): Promise<CountResponse> {
    const res = await fetch(UserAPI.baseUrl + `/count?isVerified=true`, {
      credentials: "include",
    })
    return await res.json()
  }
}
