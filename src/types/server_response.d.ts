interface IResponse<T> {
  status: number
  message?: string
  data?: T,
  errors?: string[]
}
