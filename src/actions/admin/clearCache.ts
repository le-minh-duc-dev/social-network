"use server"

import { UnstableCacheKey } from "@/domain/enums/UnstableCacheKey"
import { revalidateTag } from "next/cache"

export async function clearCache(type: UnstableCacheKey | "ALL") {
  if (type === "ALL") {
    Object.values(UnstableCacheKey).forEach((key) => {
      revalidateTag(key)
    })
  } else {
    revalidateTag(type)
  }
}
