'use client'

import { useEffect, useRef, useState } from 'react'
import ImageLazy from '../ImageLazy'
import styles from './waterfall.module.scss'

const actionsList = [
  {
    action: 'copy',
    icon: 'icon-fuzhi',
  },
  {
    action: 'download',
    icon: 'icon-xiazai',
  },
]

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
  data: any[]
  onClick: (p: any) => void
}) {
  const containerElm = useRef<HTMLDivElement>(null)
  const [itemW, setItemW] = useState<number>(0)
  const [col, setCol] = useState<number[]>([])
  const [waterfallData, setWaterFallData] = useState<any[]>([])

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

  const renderLayout = (data: any[]) => {
    data.forEach(item => {
      // 获取列高度最小的下标
      const minIndex = col.indexOf(Math.min(...col))
      // x偏移量
      const offsetX = (itemW + gap) * minIndex
      // y偏移量
      const offsetY = col[minIndex]
      // TODO 获取每一项的高度
      col[minIndex] += 400 + gap
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
      style={{ '--itemW': itemW }}>
      {waterfallData.map(
        ({ name, width, height, download_url, sha, style }, index) => {
          return (
            <div
              key={sha + index}
              className={styles['water-fall-item']}
              style={{ ...style }}>
              <ImageLazy
                className="w-full h-full transition-all hover:scale-110"
                target={containerElm.current?.parentElement}
                lazy={true}
                style={{
                  textColor: 'rgb(var(--foreground))',
                  bgColor: 'rgb(var(--background))',
                }}
                src={download_url}
                width={width}
                height={height}
                alt={name}
              />
            </div>
          )
        }
      )}
    </div>
  )
}
