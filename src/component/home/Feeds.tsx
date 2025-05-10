"use client"
import { QueryKey } from "@/domain/enums/QueryKey"
import { PostAPI } from "@/service/PostAPI"
import { Post as PostType } from "@/types/schema"
import { useInfiniteQuery } from "@tanstack/react-query"
import Post from "./Post"
import { useMemo } from "react"

export default function Feeds() {
  type PostResponse = {
    posts: PostType[]
    nextCursor: string | null
  }
  const fetchPosts = async ({
    pageParam = null,
  }: {
    pageParam?: string | null
  }): Promise<PostResponse> => {
    return await PostAPI.getPosts(pageParam)
  }
  const {
    data,
    // fetchNextPage,
    // hasNextPage,
    // isFetchingNextPage,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [QueryKey.GET_POSTS],
    queryFn: fetchPosts,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor, // from API response
  })

  const allPosts = useMemo<PostType[]>(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data]
  )

  if (isLoading) {
    return <div className="mt-6">Loading...</div>
  }
  if (error) {
    return <div className="mt-6">Error: {error.message}</div>
  }
  return (
    <div className="mt-6 w-[450px] grid gap-y-8">
      {allPosts.map((post) => (
        <Post post={post} key={post._id.toString()} />
      ))}
    </div>
  )
}
