import { Comment } from "@/types/schema"

export class CommentAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/comments"

  static async getComments(
    postId: string,
    nextCursor: string,
    limit: number = 2
  ): Promise<InfiniteResponse<Comment>> {
    const res = await fetch(
      this.baseUrl +
        `?postId=${postId}&nextCursor=${nextCursor}&limit=${limit}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
