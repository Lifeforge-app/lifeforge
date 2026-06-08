export interface BaseResponse<T = ''> {
  data?: T
  state: 'success' | 'error' | 'accepted'
  message?: string
}
