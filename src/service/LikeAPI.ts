export class LikeAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/likes"

  static async checkLikeExists(postId: string): Promise<{ exists: boolean }> {
    const res = await fetch(this.baseUrl + "/exists" + `?postId=${postId}`, {
      credentials: "include",
    })
    return await res.json()
  }
}
