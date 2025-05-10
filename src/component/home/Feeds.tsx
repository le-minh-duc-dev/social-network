"use client"
import { QueryKey } from "@/domain/enums/QueryKey"
import { PostAPI } from "@/service/PostAPI"
import { Post } from "@/types/schema"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"

export default function Feeds() {
  const [posts, setPosts] = useState<Post[]>([])
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
    <div className="mt-6">
      {posts.map((post) => (
        <div key={post._id as string} className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">{post.caption}</h2>
        </div>
      ))}
    </div>
  )
}
