export interface KValue<T = any> {
  key: string
  value: T
  createdAt: number
  setBy: string
}
