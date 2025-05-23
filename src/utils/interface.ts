export interface ImageReadResult {
  name: string
  type: string
  base64: string
  width: number
  height: number
}

export interface ImageLoadResult {
  width: number
  height: number
  message: string
}
