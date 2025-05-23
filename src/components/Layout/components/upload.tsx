import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Popover from '@/components/Popover'
import FilePick from '@/components/FilePick'
import { onLoadImageInfo, readFile2ArrayBuffer } from '@/utils'
import { ImageReadResult } from '@/utils/interface'

export default function Upload() {
  const [visible, setVisible] = useState<boolean>(false)
  const [count, setCount] = useState<number>(5)
  const [urls, setUrls] = useState([])
  const [previewList, setPreviewList] = useState<any[]>([])

  const onPickChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files as FileList
    const images: ImageReadResult[] = []
    for (const f of fileList) {
      const arrayBuffer = await readFile2ArrayBuffer(f)
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const imageInfo = await onLoadImageInfo(`data:${f.type};base64,${base64}`)
      images.push({
        name: f.name,
        type: f.type,
        base64,
        width: imageInfo.width,
        height: imageInfo.height,
      })
    }
    setUrls(images)
  }

  const getTransform = (index: number) => {
    const offsetDeg = 90 / 5
    let deg = ((previewList.length - 1) * offsetDeg) / 2
    deg = -deg + index * offsetDeg
    return {
      transform: `rotate(${deg}deg)`,
    }
  }

  const renderImage = () => {
    const imgaes = []
    for (let i = 0; i < urls.length; i++) {
      if (i < count) {
        imgaes.push(<Image key={i} src={urls[i]} alt=""></Image>)
      } else {
        const repeatIndex = i % count
      }
    }
    return imgaes
  }

  const handleClick = () => {}

  useEffect(() => {
    const list = urls.length < 5 ? urls : urls.slice(0, 5)
    setPreviewList(list)
  }, [urls])

  return (
    <React.Fragment>
      <Popover visible={visible} title="弹窗">
        <div className="flex">
          <FilePick onChange={onPickChange}></FilePick>
          <div className="flex-1">
            <div></div>
            <div>{}</div>
          </div>
        </div>
      </Popover>
    </React.Fragment>
  )
}
