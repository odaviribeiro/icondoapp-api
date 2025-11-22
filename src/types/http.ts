export type GlobalResponse<T> = {
  success: boolean
  error: string | null
  data?: T
}
