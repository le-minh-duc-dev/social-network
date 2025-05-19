"use client"

import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { PostAPI } from "@/service/api/PostAPI"
import { Post as PostType } from "@/types/schema"
import Post from "./Post"
import PostSkeleton from "./PostSkeleton"
import { InfiniteWindowVirtualList } from "../InfiniteWindowVirtualList"
import { useIsBreakPoint } from "@/hooks/useIsBreakPoint"
import { BreakPoint } from "@/domain/enums/BreakPoint"

export default function Feeds() {
  const isLg = useIsBreakPoint(BreakPoint.LG)
  const isFHD = useIsBreakPoint(BreakPoint.FHD)
  const isMD = useIsBreakPoint(BreakPoint.MD)

  let width
  if (isFHD) {
    width = "450px"
  } else if (isLg) {
    width = "350px"
  } else if (isMD) {
    width = "350px"
  } else {
    width = "95%"
  }

  return (
    <InfiniteWindowVirtualList<PostType>
      queryKey={[QueryKey.GET_POSTS]}
      fetchFn={PostAPI.getPosts}
      renderItem={(post) => (
        <div className="pb-4">
          <Post post={post} />
        </div>
      )}
      skeleton={
        <div className="flex flex-col gap-y-4">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      }
      staleTime={QueryStaleTime[QueryKey.GET_POSTS]}
      itemStyle={{
        left: "50%",
        width,
        transformExtra: `translateX(-50%)`,
      }}
    />
  )
}
