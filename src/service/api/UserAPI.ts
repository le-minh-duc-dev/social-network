import { User } from "@/types/schema"

export class UserAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/users"

  static async getTotalUsers(): Promise<CountResponse> {
    const res = await fetch(UserAPI.baseUrl + `/count`, {
      credentials: "include",
    })
    return await res.json()
  }

  static async getUsers(
    nextCursor: string,
    limit: number = 2,
    searchKey: string = ""
  ): Promise<InfiniteResponse<User>> {
    const res = await fetch(
      UserAPI.baseUrl + `?nextCursor=${nextCursor}&limit=${limit}&searchKey=${searchKey}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }

  static async getUserById(userId: string): Promise<IResponse<User>> {
    const res = await fetch(UserAPI.baseUrl + `/${userId}`, {
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

  static async checkExists(
    username: string = "",
    email: string = ""
  ): Promise<{ exists: boolean }> {

    const encodedEmail = encodeURIComponent(email);
    const res = await fetch(
      this.baseUrl + "/exists" + `?username=${username}&email=${encodedEmail}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
