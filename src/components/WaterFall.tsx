import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { RepoContent, WaterData } from '@/api/interface'

export default function WaterFall({
  itemMaxW,
  gap,
  data,
  actions,
  dispatchAction,
}: {
  itemMaxW: number
  gap: number
  data: WaterData[]
  actions?: readonly any[]
  dispatchAction?: (type: any, item: WaterData) => void
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

  const computedOffset = (data: WaterData[]) => {
    setWaterFallData([])
    data.forEach(item => {
      // 获取列高度最小的下标
      const minIndex = col.indexOf(Math.min(...col))
      // x偏移量
      const offsetX = (itemW + gap) * minIndex
      // y偏移量
      const offsetY = col[minIndex]
      // 渲染的高度
      const itemH = (itemW * item.height) / item.width
      col[minIndex] += itemH + gap
      setWaterFallData(preData => [
        ...preData,
        { ...item, itemW, itemH, offsetX, offsetY },
      ])
    })
  }

  const renderLayout = () => {
    init()
    computedOffset(data)
  }

  useEffect(() => {
    renderLayout()
    // window.addEventListener('resize', renderLayout)
    // return () => {
    //   window.removeEventListener('resize', renderLayout)
    // }
  }, [])

  useEffect(() => {
    computedOffset(data)
  }, [data])

  return (
    <div ref={containerElm} className="relative w-full">
      {waterfallData.map(item => {
        return (
          <div
            key={item.sha}
            className="overflow-hidden absolute top-0 left-0 border-bcolor rounded-lg"
            style={{
              width: `${item.itemW}px`,
              height: `${item.itemH}px`,
              transform: `translate(${item.offsetX}px, ${item.offsetY}px)`,
            }}>
            <Image
              className="w-full"
              src={item.download_url}
              width={item.width}
              height={item.height}
              alt={item.name}></Image>
            <ul className="flex items-center justify-end gap-2 absolute top-0 left-0 w-full p-2">
              {actions?.map(({ type, icon }) => (
                <li
                  key={type}
                  className={`iconfont ${icon} cursor-pointer px-1 rounded bg-mask hover:text-white`}
                  onClick={() =>
                    dispatchAction && dispatchAction(type, item)
                  }></li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
