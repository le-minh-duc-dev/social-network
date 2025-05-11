import { QueryKey } from "@/domain/enums/QueryKey"
import { CommentAPI } from "@/service/CommentAPI"
import { Comment as CommentType, User } from "@/types/schema"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import React, { useMemo } from "react"
import Comment from "./Comment"

export default function CommentList({ postId }: Readonly<{ postId: string }>) {
  const fetchFn = async ({ pageParam = "" }: { pageParam: string }) => {
    return await CommentAPI.getComments(postId, pageParam)
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: [QueryKey.GET_POST_COMMENTS],
    queryFn: fetchFn,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const allRows = useMemo<CommentType[]>(
    () => data?.pages.flatMap((page) => page.list) ?? [],
    [data]
  )

  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  React.useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]

    if (!lastItem) {
      return
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    virtualItems,
  ])

  switch (status) {
    case "pending":
      return <p>Loading...</p>
    case "error":
      return <p>Something went wrong! {error.message}</p>
  }
  return (
    <div
      ref={parentRef}
      className="flex-1 max-h-full "
      style={{
        width: `100%`,
        height: 500,
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
          }}
        >
          {virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allRows.length - 1
            const row = allRows[virtualRow.index]
            const author = row?.author as User | undefined
            return (
              <div
                key={virtualRow.index}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    "Loading more..."
                  ) : (
                    "Nothing more to load"
                  )
                ) : (
                  <div key={row._id.toString()} className="py-2">
                    <Comment
                      name={author?.fullName ?? ""}
                      avatarUrl={author?.avatarUrl}
                      createdAt={row.createdAt}
                      content={row.content}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
