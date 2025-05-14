import { Post } from "@/types/schema"

export class SavedAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/saveds"

  static async checkSavedExists(postId: string): Promise<{ exists: boolean }> {
    const res = await fetch(this.baseUrl + "/exists" + `?postId=${postId}`, {
      credentials: "include",
    })
    return await res.json()
  }

  static async getSavedPosts(
    nextCursor: string,
    limit: number = 2
  ): Promise<InfiniteResponse<Post>> {
    const res = await fetch(
      SavedAPI.baseUrl + `?nextCursor=${nextCursor}&limit=${limit}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
