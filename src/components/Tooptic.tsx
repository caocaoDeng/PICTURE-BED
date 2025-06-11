import React, { useRef, useState, CSSProperties } from 'react'
import Image from 'next/image'

export default function Tooptic({
  info,
  children,
}: {
  info: any
  children: React.ReactNode
}) {
  const elm = useRef<HTMLDivElement>(null)
  const [isReverse, setIsReverse] = useState<Boolean>(false)
  const [divStyle, setDivStyle] = useState<CSSProperties>({})

  const onMouseEnter = (e: React.MouseEvent) => {
    // const target = elm.current?.firstChild as HTMLDivElement
    const { top, left, right, height } = (
      e.target as HTMLDivElement
    ).getBoundingClientRect()
    const isReverse = window.innerWidth - right < 320
    const offsetX = isReverse ? left : right
    const offsetY = top + height / 2
    setIsReverse(isReverse)
    setDivStyle({
      top: `${offsetY}px`,
      left: `${offsetX}px`,
    })
  }

  return (
    <div ref={elm} className="tooptic group" onMouseEnter={onMouseEnter}>
      {children}
      <div
        className={`tooptic-info fixed z-99999 w-80 p-2 rounded-lg -translate-y-1/2 bg-background hidden group-hover:block shadow-xl after:absolute after:top-1/2 after:border-8 after:border-transparent after:-translate-y-1/2 ${
          isReverse
            ? '-m-4 -translate-full after:right-0 after:translate-full after:border-l-background'
            : 'm-4 after:left-0 after:-translate-full after:border-r-background'
        }`}
        style={divStyle}>
        <Image
          className="w-full"
          src={info.download_url}
          width={info.width}
          height={info.height}
          alt={info.name}
        />
      </div>
    </div>
  )
}
