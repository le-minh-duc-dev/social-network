interface IResponse<T> {
  status: number
  message?: string
  data?: T
  errors?: string[]
}

interface InfiniteResponse<T> {
  list: T[]
  nextCursor: string
  hasMore:boolean
}
