export interface UnknownResponse {
  error: {
    [key: string]: string
  }
}

export interface ApiResponse<T> {
  status: number
  data: T | null
}
