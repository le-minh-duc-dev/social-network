"use client"
import { MediaType } from "@/domain/enums/MediaType"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { PostAPI } from "@/service/api/PostAPI"
import { Post } from "@/types/schema"
import { useInfiniteQuery } from "@tanstack/react-query"
import React, { useMemo, useRef, useState } from "react"
import ReelVideo from "./ReelVideo"
import CommentList from "./CommentList"

interface PostTypeWithKey extends Post {
  key: string
}

export default function Reels() {
  //Current index of the post
  const [currentIndex, setCurrentIndex] = useState(0)

  //isOpen comment list
  const [isOpenCommentList, setIsOpenCommentList] = useState(false)

  //Scroll timeout ref

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const touchStartY = useRef<number | null>(null)
  const touchEndY = useRef<number | null>(null)

  //Fetch posts
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

  //Handle change index
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

  //Handle scroll
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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY

    const diff = (touchStartY.current ?? 0) - (touchEndY.current ?? 0)

    if (Math.abs(diff) < 50) return // Ignore small swipes

    if (diff > 0) {
      // Swipe Up
      handleChangeIndex("down")
    } else {
      // Swipe Down
      handleChangeIndex("up")
    }

    // Debounce swipe
    scrollTimeoutRef.current = setTimeout(() => {
      scrollTimeoutRef.current = null
    }, 500)
  }

  return (
    <>
      <div className="flex-1  z-0  overflow-hidden relative hidden md:block">
        <div
          className="flex justify-center items-center h-full overflow-hidden relative"
          onWheel={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ReelVideo
            post={currentPost}
            isOpenCommentList={isOpenCommentList}
            toggleCommentList={() => setIsOpenCommentList(!isOpenCommentList)}
            currentIndex={currentIndex}
            handleChangeIndex={handleChangeIndex}
          />
        </div>
        {currentPost && isOpenCommentList && (
          <div className="absolute top-0 right-0 w-96 h-full bg-default-100 z-20">
            <CommentList
              post={currentPost}
              toggleCommentList={() => setIsOpenCommentList(!isOpenCommentList)}
            />
          </div>
        )}
      </div>
      {/* Mobile view */}
      <div className="flex-1 max-h-screen z-0 flex overflow-hidden relative md:hidden">
        <div
          className="flex justify-center flex-1  overflow-hidden relative mb-12"
          onWheel={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ReelVideo
            post={currentPost}
            isOpenCommentList={isOpenCommentList}
            toggleCommentList={() => setIsOpenCommentList(!isOpenCommentList)}
            currentIndex={currentIndex}
            handleChangeIndex={handleChangeIndex}
          />
        </div>
      </div>
    </>
  )
}
