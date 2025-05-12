"use client"


import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { PostAPI } from "@/service/PostAPI"
import { Post as PostType } from "@/types/schema"
import Post from "./Post"
import PostSkeleton from "./PostSkeleton"
import { InfiniteWindowVirtualList } from "../InfiniteWindowVirtualList"

export default function Feeds() {
  return (
    <InfiniteWindowVirtualList<PostType>
      queryKey={[QueryKey.GET_POSTS]}
      fetchFn={PostAPI.getPosts}
      renderItem={(post) => (
        <div className="pb-4">
          <Post post={post} />
        </div>
      )}
      Skeleton={PostSkeleton}
      staleTime={QueryStaleTime[QueryKey.GET_POSTS]}
    />
  )
  
}
