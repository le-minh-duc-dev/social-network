import { MediaType } from "@/domain/enums/MediaType"
import { Post } from "@/types/schema"

export class PostAPI {
  static readonly baseUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/posts"

  static async getPosts(
    nextCursor: string,
    limit: number = 2,
    authorId: string = "",
    isExplore: boolean = false,
    isReels: boolean = false,
    mediaType: string=""
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
