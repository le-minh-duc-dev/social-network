import { Post } from "@/types/schema"

export class PostAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/posts"

  static async getPosts(
    nextCursor: string | null,
    limit: number = 10
  ): Promise<{ posts: Post[]; nextCursor: string | null }> {
    const res = await fetch(
      this.baseUrl + `?nextCursor=${nextCursor}&limit=${limit}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
