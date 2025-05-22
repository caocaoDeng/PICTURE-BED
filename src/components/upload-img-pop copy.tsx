import { useState, useEffect } from 'react'
import Image from 'next/image'
import FilePick from './FilePick'

export default function UploadImgPop() {
  const [actionIndex, setACtionIndex] = useState<number[]>([0, 5])
  const [urls, setUrls] = useState([])
  const [previewList, setPreviewList] = useState<any[]>([])

  const offsetDeg = 90 / 5

  useEffect(() => {
    const [start, end] = actionIndex
    const imgList = urls.slice(start, end).reverse()
    setPreviewList(imgList)
    init()
  }, [urls])

  const init = () => {
    let deg = ((previewList.length - 1) * offsetDeg) / 2
    const imgList = previewList.map((item, index) => {
      deg = -deg + index * offsetDeg
      return {
        src: item,
        deg,
      }
    })
    setPreviewList(imgList)
  }

  const getTransform = (index: number) => {
    const offsetDeg = 90 / 5
    let deg = ((previewList.length - 1) * offsetDeg) / 2
    deg = -deg + index * offsetDeg
    return {
      transform: `rotate(${deg}deg)`,
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files as FileList
  }

  const handleClick = () => {
    let [start, end] = actionIndex
    previewList.map(item => ({
      ...item,
      deg: item.deg + 18,
    }))
  }

  return (
    <div className="flex">
      <div className="pick-container flex-1">
        <FilePick onChange={onChange}></FilePick>
      </div>
      <div className="preview flex-1 flex flex-col">
        <div className="preview-item"></div>
        <div className="preview-item">
          <div className="images" onClick={handleClick}>
            {previewList.map((url, index) => (
              <Image
                className="image-item"
                style={getTransform(index)}
                key={index}
                src={url}
                alt=""></Image>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
