import React, { useEffect, useRef, useState } from 'react'
import LazyImage from './LazyImage'
import type { WaterData } from '@/api/interface'

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
  const config: {
    width: number
    columns: number[]
  } = {
    width: 0,
    columns: [],
  }

  const containerElm = useRef<HTMLDivElement>(null)
  const [waterfallData, setWaterFallData] = useState<WaterData[]>([])

  /**
   * 列数，每一项宽度
   * @returns void
   */
  const getInfo = () => {
    const divInfo = containerElm.current?.getBoundingClientRect()
    if (!divInfo) return
    // 列数
    const length: number = Math.floor(divInfo.width / itemMaxW)
    // gap 总宽度
    const gapW = (length - 1) * gap
    // 根据列重新计算每一项的宽度
    const width = (divInfo.width - gapW) / length
    config.width = width
    config.columns = Array.from({ length }, () => 0)
  }

  const computedOffset = () => {
    config.columns.fill(0)
    setWaterFallData([])
    data.forEach(item => {
      const { width, columns } = config
      // 获取列高度最小的下标
      const minIndex = columns.indexOf(Math.min(...columns))
      // x偏移量
      const offsetX = (width + gap) * minIndex
      // y偏移量
      const offsetY = columns[minIndex]
      // 渲染的高度
      const itemH = (width * item.height) / item.width
      columns[minIndex] += itemH + gap
      setWaterFallData(preData => [
        ...preData,
        { ...item, itemW: width, itemH, offsetX, offsetY },
      ])
    })
  }

  const init = () => {
    getInfo()
    computedOffset()
  }

  useEffect(computedOffset, [data])

  useEffect(() => {
    init()
    window.addEventListener('resize', init)
    return () => {
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <div
      ref={containerElm}
      className="relative w-full"
      style={{ height: `${Math.max(...config.columns)}px` }}>
      {waterfallData.map(item => {
        return (
          <div
            key={item.sha}
            className="overflow-hidden absolute top-0 left-0 border-1 border-bcolor rounded-lg cursor-pointer duration-200"
            style={{
              width: `${item.itemW}px`,
              height: `${item.itemH}px`,
              transform: `translate(${item.offsetX}px, ${item.offsetY}px)`,
            }}>
            <LazyImage
              className="w-full h-full duration-200 hover:scale-150"
              target={containerElm.current?.parentElement}
              isLazy={true}
              src={item.download_url}
              width={item.width}
              height={item.height}
              alt={item.name}
            />
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
