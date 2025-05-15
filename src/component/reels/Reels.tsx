"use client"
import { MediaType } from "@/domain/enums/MediaType"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { PostAPI } from "@/service/api/PostAPI"
import { Post } from "@/types/schema"
import { useInfiniteQuery } from "@tanstack/react-query"
import React, { useMemo, useRef, useState } from "react"
import ReelVideo from "./ReelVideo"
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa"
import { Button } from "@heroui/react"

interface PostTypeWithKey extends Post {
  key: string
}

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const queryFn = async ({
    pageParam = "",
  }: {
    pageParam: string
  }): Promise<InfiniteResponse<Post>> => {
    return await PostAPI.getPosts(pageParam, 10, "", false, true)
  }
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [QueryKey.GET_POSTS, "Reels"],
      queryFn,
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: QueryStaleTime[QueryKey.GET_POSTS],
    })

  const allItems = useMemo<PostTypeWithKey[]>(
    () =>
      data?.pages
        .flatMap((page) => page.list)
        .flatMap((post) =>
          post.media
            .filter((m) => m.type == MediaType.VIDEO)
            .map((m, index) => ({
              ...post,
              media: [m],
              key: post._id.toString() + index,
            }))
        ) ?? [],
    [data]
  )

  const currentPost = allItems[currentIndex]

  const handleChangeIndex = (direction: "up" | "down") => {
    if (direction === "down") {
      if (currentIndex < allItems.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (hasNextPage && !isFetchingNextPage) {
        setCurrentIndex((prev) => prev + 1)
        fetchNextPage()
      }
    } else if (direction === "up" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault()
    if (scrollTimeoutRef.current) return

    if (e.deltaY > 50) {
      handleChangeIndex("down")
    } else if (e.deltaY < -50) {
      handleChangeIndex("up")
    }

    // debounce scroll
    scrollTimeoutRef.current = setTimeout(() => {
      scrollTimeoutRef.current = null
    }, 500)
  }

  return (
    <div className="flex-1  z-0  overflow-hidden" onWheel={handleScroll}>
      <div className="flex justify-center items-center h-full overflow-hidden relative">
        <ReelVideo post={currentPost} />

        {currentPost && (
          <div className="flex flex-col gap-y-8">
            <Button
              isIconOnly
              variant="light"
              className="group"
              onPress={() => handleChangeIndex("up")}
              isDisabled={currentIndex == 0}
            >
              <FaChevronCircleUp className="text-xl opacity-60  group-hover:opacity-100" />
            </Button>

            <Button
              isIconOnly
              variant="light"
              className="group"
              onPress={() => handleChangeIndex("down")}
            >
              <FaChevronCircleDown className="text-xl opacity-60  group-hover:opacity-100" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
