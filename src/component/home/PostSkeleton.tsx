"use client"
import { Skeleton } from "@heroui/react"

export default function PostSkeleton() {
 
  return (
    <div className="w-[95vw] md:w-[350px] xl:w-[450px] p-4" >
      <div className=" flex items-center gap-3">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
        </div>
      </div>
      <Skeleton className="rounded-lg mt-4">
        <div className="aspect-[9/13] rounded-lg bg-secondary" />
      </Skeleton>
    </div>
  )
}
