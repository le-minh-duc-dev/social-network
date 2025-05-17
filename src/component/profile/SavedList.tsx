import React, { useEffect, useMemo } from "react"
import { Post as PostType } from "@/types/schema"
import { useAuth } from "@/component/provider/auth/AuthContext"
import { QueryKey, QueryStaleTime } from "@/domain/enums/QueryKey"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import PostPreview from "./PostPreview"
import { SavedAPI } from "@/service/api/SavedAPI"
import { Skeleton } from "@heroui/react"

const ITEMS_PER_ROW = 3

export default function SavedList() {
  const { authUser } = useAuth()
  const queryFn = async ({
    pageParam = "",
  }: {
    pageParam: string
  }): Promise<InfiniteResponse<PostType>> => {
    return await SavedAPI.getSavedPosts(pageParam, 2)
  }
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [QueryKey.GET_USER_SAVEDS, "USER", authUser?.id],
    queryFn,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: QueryStaleTime[QueryKey.GET_USER_SAVEDS],
  })

  const allItems = useMemo<PostType[]>(
    () => data?.pages.flatMap((page) => page.list) ?? [],
    [data]
  )

  const rows = useMemo(() => {
    const temp = []
    for (let i = 0; i < allItems.length; i += ITEMS_PER_ROW) {
      temp.push(allItems.slice(i, i + ITEMS_PER_ROW))
    }
    return temp
  }, [allItems])

  const listRef = React.useRef<HTMLDivElement | null>(null)

  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length,
    estimateSize: () => 450,
    overscan: 3,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const last = virtualItems[virtualItems.length - 1]
    if (!isFetchingNextPage && hasNextPage && last?.index >= rows.length - 1) {
      fetchNextPage()
    }
  }, [
    virtualItems,
    rows.length,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ])

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4  mt-4">
        <Skeleton className="w-full aspect-[4/5] rounded-lg" />
        <Skeleton className="w-full aspect-[4/5] rounded-lg" />
        <Skeleton className="w-full aspect-[4/5] rounded-lg" />
        <Skeleton className="w-full aspect-[4/5] rounded-lg" />
        <Skeleton className="w-full aspect-[4/5] rounded-lg" />
        <Skeleton className="w-full aspect-[4/5] rounded-lg" />
      </div>
    )
  }

  if (error) {
    console.log(error)
    return <div>Error: {error.message}</div>
  }

  console.log("allItems", allItems)
  return (
    <div ref={listRef}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((item) => {
          const row = rows[item.index]
          return (
            <div
              key={item.key}
              data-index={item.index}
              className={item.index % 2 ? "ListItemOdd" : "ListItemEven"}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${
                  item.start - virtualizer.options.scrollMargin
                }px)`,
              }}
            >
              {row ? (
                <div className="grid grid-cols-3 gap-4 ">
                  {row.map((post) => (
                    <PostPreview
                      key={post._id.toString()}
                      post={post}
                      height="aspect-[4/5]"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4  mt-4">
                  <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                  <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                  <Skeleton className="w-full aspect-[4/5] rounded-lg" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
