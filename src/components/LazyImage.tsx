import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function LazyImage({
  target,
  isLazy = false,
  src,
  alt,
  className,
  ...rest
}: {
  target?: Window | HTMLElement | null
  isLazy?: boolean
  src: string
  alt: string
  [key: string]: any
}) {
  const elm = useRef<HTMLDivElement>(null)
  const [imgSrc, setImgSrc] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  /**
   * 判断是否在窗口内
   * @param scrollTop 滚动条的位置
   * @returns boolean
   */
  const determineInWindow = (scrollTop: number) => {
    const windowHeight = screen.height
    const { top } = elm.current?.getBoundingClientRect() as DOMRect
    return top - scrollTop < windowHeight
  }

  /**
   * 加载图片
   * @returns Promise<boolean>
   */
  const onLoad = () => {
    return new Promise<boolean>((res, rej) => {
      setLoading(true)
      const image = new window.Image()
      image.src = src
      image.onload = () => res(true)
      image.onerror = () => rej(false)
      image.onabort = () => rej(false)
    })
      .then(() => {
        setImgSrc(src)
      })
      .catch(() => {
        setImgSrc('/error.png')
      })
      .finally(() => {
        setLoading(false)
        removeEventListener()
      })
  }

  /**
   * 加载逻辑
   * @param e Scroll Event
   * @returns Promise
   */
  const init = async (e?: Event) => {
    if (!isLazy) return await onLoad()
    const scrollTop = (e?.target as HTMLElement)?.scrollTop || 0
    const isInWindow = determineInWindow(scrollTop)
    isInWindow && (await onLoad())
  }

  // 注册监听事件
  const installEventListener = () => {
    const targetElm = target === undefined ? window : target
    targetElm?.addEventListener('scroll', init)
  }

  // 移除监听事件
  const removeEventListener = () => {
    const targetElm = target === undefined ? window : target
    targetElm?.removeEventListener('scroll', init)
  }

  useEffect(() => {
    isLazy && installEventListener()
  }, [target])

  useEffect(() => {
    init()
  }, [])

  return (
    <div ref={elm} className={`lazy-image relative bg-gray-50 ${className}`}>
      {!loading ? (
        <Image
          className="w-full h-full object-contain"
          src={imgSrc}
          alt={alt}
          {...rest}
          loader={({ src, width, quality }) =>
            `${src}?w=${width}&q=${quality || 75}`
          }></Image>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
          <p className="iconfont icon-loading1 animate-spin"></p>
        </div>
      )}
    </div>
  )
}
