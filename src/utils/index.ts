import { ImageLoadResult } from './interface'

// 读取文件，转base64
export const readFile2Base64 = (file: File): Promise<string> => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.addEventListener('load', (e: ProgressEvent<FileReader>) =>
      res(e.target?.result as string)
    )
    reader.addEventListener('error', rej)
    reader.addEventListener('abort', rej)
    reader.readAsDataURL(file)
  })
}

// 读取文件，转 ArrayBuffer
export const readFile2ArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.addEventListener('load', (e: ProgressEvent<FileReader>) =>
      res(e.target?.result as ArrayBuffer)
    )
    reader.addEventListener('error', rej)
    reader.addEventListener('abort', rej)
    reader.readAsArrayBuffer(file)
  })
}

// 加载图片信息
export const onLoadImageInfo = (
  value: File | Base64URLString | string
): Promise<ImageLoadResult> => {
  const src =
    typeof value === 'string' ? value : URL.createObjectURL(new Blob([value]))
  return new Promise<ImageLoadResult>((res, rej) => {
    const image = new Image()
    image.src = src
    image.onload = () =>
      res({ width: image.width, height: image.height, message: '图片加载成功' })
    image.onerror = () => rej({ message: '图片加载失败' })
    image.onabort = () => rej({ message: '图片加载失败' })
  }).finally(() => {
    URL.revokeObjectURL(src)
  })
}

/**
 * 下载函数
 * @param url 资源地址
 * @param name 文件名称
 */
export const download = (url: string, name: string) => {
  const tag_a = document.createElement('a')
  tag_a.setAttribute('href', url)
  tag_a.setAttribute('download', name)
  tag_a.click()
}
