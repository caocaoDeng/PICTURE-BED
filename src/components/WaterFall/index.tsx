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
    let col: number | number[] = divInfo.width / itemMaxW
    // 根据列重新计算每一项的宽度
    const itemW = divInfo.width - ((col - 1) * gap) / col
    col = new Array(col).fill(0)
    setItemW(itemW)
    setCol(col)
  }

  const renderLayout = (data: WaterData[]) => {
    data.forEach(item => {
      // 获取列高度最小的下标
      const minIndex = col.indexOf(Math.min(...col))
      // x偏移量
      const offsetX = (itemW + gap) * minIndex
      // y偏移量
      const offsetY = col[minIndex]
      col[minIndex] += item.height + gap
      setWaterFallData([...waterfallData, { ...item, offsetX, offsetY }])
    })
  }

  useEffect(() => {
    init()
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
      style={{ '--itemW': itemW } as React.CSSProperties}>
      {waterfallData.map(({ name, width, height, download_url, sha }) => {
        return (
          <div key={sha} className={styles['water-fall-item']}>
            <Image
              src={download_url}
              width={width}
              height={height}
              alt={name}></Image>
          </div>
        )
      })}
    </div>
  )
}
