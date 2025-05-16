import { AuthUser } from "@/types/auth"

export class AuthAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/auth"

  static async getAuthUser(userId: string): Promise<AuthUser> {
    const res = await fetch(this.baseUrl + "/me/" + userId, {
      credentials: "include",
    })
    return await res.json()
  }
}
