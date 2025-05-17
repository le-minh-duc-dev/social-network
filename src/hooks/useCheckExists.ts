/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

type UseCheckExistsParams<T> = {
  value: T
  checkFn: (val: T) => Promise<{ exists: boolean }>
  queryKeyPrefix: string | any[] // for queryKey
  debounceTime?: number
  enabled?: boolean
}

export function useCheckExists<T>({
  value,
  checkFn,
  queryKeyPrefix,
  debounceTime = 1000,
  enabled = true,
}: UseCheckExistsParams<T>) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceTime)

    return () => clearTimeout(handler)
  }, [value, debounceTime])

  const queryKey = Array.isArray(queryKeyPrefix)
    ? [...queryKeyPrefix, debouncedValue]
    : [queryKeyPrefix, debouncedValue]

  const query = useQuery({
    queryFn: () => checkFn(debouncedValue),
    queryKey,
    enabled: enabled && !!debouncedValue,
  })

  return {
    ...query,
    debouncedValue,
  }
}
