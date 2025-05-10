"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { useMemo, useEffect } from "react"
import { QueryKey } from "@/domain/enums/QueryKey"
import { PostAPI } from "@/service/PostAPI"
import { Post as PostType } from "@/types/schema"
import Post from "./Post"

type PostResponse = {
  posts: PostType[]
  nextCursor: string | null
}

export default function Feeds() {
  const fetchPosts = async ({
    pageParam = "",
  }: {
    pageParam: string
  }): Promise<PostResponse> => {
    return await PostAPI.getPosts(pageParam)
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [QueryKey.GET_POSTS],
    queryFn: fetchPosts,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const allPosts = useMemo<PostType[]>(
    () => data?.pages.flatMap((page) => page.posts) ?? [],
    [data]
  )

  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    estimateSize: () => 900,
    overscan: 0,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const last = virtualItems[virtualItems.length - 1]
    if (
      !isFetchingNextPage &&
      hasNextPage &&
      last?.index >= allPosts.length - 1
    ) {
      fetchNextPage()
    }
  }, [
    virtualItems,
    allPosts.length,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ])

  if (isLoading) return <div className="mt-6">Loading...</div>
  if (error) return <div className="mt-6">Error: {error.message}</div>

  return (
    <div
      style={{
        height: virtualizer.getTotalSize(),
        position: "relative",
      }}
      className=""
    >
      {virtualItems.map((virtualRow) => {
        const post = allPosts[virtualRow.index]

        return (
          <div
            key={virtualRow.key}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: "450px",
              transform: `translateY(${virtualRow.start}px) translateX(-50%)`,
            }}
          >
            {post ? (
              <Post post={post} />
            ) : hasNextPage ? (
              <div className="py-6 text-center text-gray-400">
                Loading more...
              </div>
            ) : (
              <div className="py-6 text-center text-gray-400">
                No more posts
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
