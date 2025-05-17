import { Post } from "@/types/schema"

const FETCH_SIZE = 10
export class PostAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/posts"

  static async getPosts(
    nextCursor: string,
    limit: number = FETCH_SIZE,
    authorId: string = "",
    isExplore: boolean = false,
    isReels: boolean = false,
    mediaType: string = ""
  ): Promise<InfiniteResponse<Post>> {
    const res = await fetch(
      PostAPI.baseUrl +
        `?nextCursor=${nextCursor}&limit=${limit}&authorId=${authorId}&isExplore=${isExplore}&isReels=${isReels}&mediaType=${mediaType}`,
      {
        credentials: "include",
      }
    )
    return await res.json()
  }
}
