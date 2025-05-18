import { useInfiniteQuery, QueryKey } from "@tanstack/react-query"
import { useVirtualizer } from "@tanstack/react-virtual"
import React, { useMemo, useEffect, ReactNode, ComponentType } from "react"

type Props<T> = {
  queryKey: QueryKey
  fetchFn: (pageParam: string) => Promise<InfiniteResponse<T>>
  staleTime?: number
  estimateSize?: () => number
  renderItem: (item: T, index: number) => ReactNode
  Skeleton?: ComponentType
  ErrorComponent?: (msg: string) => ReactNode
  EmptyComponent?: ComponentType
  refetchInterval?: number
  paddingEnd?: number
}

export function InfiniteVirtualList<T>({
  staleTime = 60000,
  estimateSize = () => 900,
  refetchInterval = 60000,
  queryKey,
  fetchFn,
  renderItem,
  Skeleton,
  ErrorComponent,
  EmptyComponent,
  paddingEnd = 200,
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
    refetchInterval,
  })

  const allItems = useMemo<T[]>(
    () => data?.pages.flatMap((page) => page.list) ?? [],
    [data]
  )

  const parentRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 3,
    paddingEnd,
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
      <div className="flex flex-col h-full w-full ">
        {Skeleton ? <Skeleton /> : <p>Loading...</p>}
      </div>
    )
  }

  if (allItems.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        {EmptyComponent ? <EmptyComponent /> : <p>No items.</p>}
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
      ref={parentRef}
      className="flex-1 h-full overflow-hidden"
      style={{
        width: `100%`,
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
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
            const item = allItems[virtualRow.index]

            return (
              <div
                key={virtualRow.key}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
              >
                {item ? (
                  renderItem(item, virtualRow.index)
                ) : hasNextPage && Skeleton ? (
                  <Skeleton />
                ) : (
                  <div className="text-center text-gray-400 py-6">
                    No more items
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
