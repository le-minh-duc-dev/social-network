import { useInfiniteQuery, QueryKey } from "@tanstack/react-query"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import React, { useMemo, useEffect, ReactNode } from "react"

type Props<T> = {
  queryKey: QueryKey
  fetchFn: (pageParam: string) => Promise<InfiniteResponse<T>>
  staleTime?: number
  estimateSize?: () => number
  renderItem: (item: T, index: number) => ReactNode
  skeleton?: ReactNode
  ErrorComponent?: (msg: string) => ReactNode
  itemStyle?: { left: string; width: string; transformExtra: string }
}

export function InfiniteWindowVirtualList<T>({
  staleTime = 60000,
  estimateSize = () => 900,
  itemStyle = {
    left: "50%",
    width: "450px",
    transformExtra: `translateX(-50%)`,
  },
  queryKey,
  fetchFn,
  renderItem,
  skeleton,
  ErrorComponent,
}: Readonly<Props<T>>) {
  const queryFn = async ({
    pageParam = "",
  }: {
    pageParam: string
  }): Promise<InfiniteResponse<T>> => {
    return await fetchFn(pageParam)
  }
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime,
    refetchIntervalInBackground: true,
    refetchInterval: staleTime,
  })

  const allItems = useMemo<T[]>(
    () => data?.pages.flatMap((page) => page.list) ?? [],
    [data]
  )

  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    estimateSize,
    overscan: 0,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const last = virtualItems[virtualItems.length - 1]
    if (
      !isFetchingNextPage &&
      hasNextPage &&
      last?.index >= allItems.length - 1
    ) {
      fetchNextPage()
    }
  }, [
    virtualItems,
    allItems.length,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        {skeleton ?? <p>Loading...</p>}
      </div>
    )
  }

  if (error) {
    console.log(error)
    return ErrorComponent ? (
      ErrorComponent(error.message)
    ) : (
      <div>Error: {error.message}</div>
    )
  }

  return (
    <div
      style={{
        height: virtualizer.getTotalSize(),
        position: "relative",
      }}
    >
      {virtualItems.map((virtualRow) => {
        const item = allItems[virtualRow.index]

        return (
          <div
            key={virtualRow.key}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
            style={{
              position: "absolute",
              top: 0,
              left: itemStyle.left,
              width: itemStyle.width,
              transform: `translateY(${virtualRow.start}px) ${itemStyle.transformExtra}`,
            }}
          >
            {item ? (
              renderItem(item, virtualRow.index)
            ) : hasNextPage && skeleton ? (
              skeleton
            ) : (
              <div className="text-center text-gray-400 py-6">
                No more items
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
