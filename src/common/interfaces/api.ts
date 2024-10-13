export interface IPaginationResponse<T> {
  count: number
  prev: string
  next: string
  results: T
}

export interface IError {
  code: string
  details: string
}
