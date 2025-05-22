import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { WaterData } from '@/api/interface'
import styles from './waterfall.module.scss'

export interface Action {
  type: string
  payload: {
    name: string
    url: string
  }
}

export default function WaterFall({
  itemMaxW,
  gap,
  data,
}: {
  itemMaxW: number
  gap: number
  data: WaterData[]
  onClick?: (p: WaterData) => void
}) {
  const containerElm = useRef<HTMLDivElement>(null)
  const [itemW, setItemW] = useState<number>(0)
  const [col, setCol] = useState<number[]>([])
  const [waterfallData, setWaterFallData] = useState<WaterData[]>([])

  /**
   * 列数，每一项宽度
   * @returns void
   */
  const init = () => {
    const divInfo = containerElm.current?.getBoundingClientRect()
    if (!divInfo) return
    // 列数
    const length: number = Math.floor(divInfo.width / itemMaxW)
    // gap 总宽度
    const gapW = (length - 1) * gap
    // 根据列重新计算每一项的宽度
    const itemW = (divInfo.width - gapW) / length
    const colums = Array.from({ length }, () => 0)
    setItemW(itemW)
    setCol(colums)
  }

  const renderLayout = (data: WaterData[]) => {
    data.forEach(item => {
      // 获取列高度最小的下标
      const minIndex = col.indexOf(Math.min(...col))
      // x偏移量
      const offsetX = (itemW + gap) * minIndex
      // y偏移量
      const offsetY = col[minIndex]
      // 渲染的高度
      const renderH = (itemW * item.height) / item.width
      col[minIndex] += renderH + gap
      setWaterFallData(preData => [
        ...preData,
        { ...item, renderH, offsetX, offsetY },
      ])
    })
  }

  useEffect(init, [])

  useEffect(() => {
    renderLayout(data)
    // window.addEventListener('resize', updateData)
    // return () => {
    //   window.removeEventListener('resize', updateData)
    // }
  }, [data])

  return (
    <div
      ref={containerElm}
      className="relative w-full"
      style={{ '--itemW': `${itemW}px` } as React.CSSProperties}>
      {waterfallData.map(
        ({
          sha,
          name,
          width,
          height,
          renderH,
          offsetX,
          offsetY,
          download_url,
        }) => {
          return (
            <div
              key={sha}
              className="absolute top-0 left-0"
              style={{
                width: 'var(--itemW)',
                height: `${renderH}px`,
                transform: `translate(${offsetX}px, ${offsetY}px)`,
              }}>
              <Image
                style={{ width: '100%' }}
                src={download_url}
                width={width}
                height={height}
                alt={name}></Image>
            </div>
          )
        }
      )}
    </div>
  )
}
