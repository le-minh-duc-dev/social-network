"use client"
import { QueryKey } from "@/domain/enums/QueryKey"
import { PostAPI } from "@/service/PostAPI"
import { Post as PostType } from "@/types/schema"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import Post from "./Post"

export default function Feeds() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const { data, isLoading, error } = useQuery({
    queryKey: [QueryKey.GET_POSTS, nextCursor],
    queryFn: () => PostAPI.getPosts(nextCursor),
  })

  useEffect(() => {
    if (data) {
      const newPosts = data.posts
      setPosts((prevPosts) => [...prevPosts, ...newPosts])
      setNextCursor(data.nextCursor)

      console.log(data)
    }
  }, [data])

  if (isLoading) {
    return <div className="mt-6">Loading...</div>
  }
  if (error) {
    return <div className="mt-6">Error: {error.message}</div>
  }
  return (
    <div className="mt-6 w-[450px]">
      {posts.map((post) => (
        <Post post={post} key={post._id.toString()} />
      ))}
    </div>
  )
}
