import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react'
import Image from 'next/image'
import Popover from '@/components/Popover'
import FilePick from '@/components/FilePick'
import { onLoadImageInfo, readFile2ArrayBuffer } from '@/utils'
import { ImageReadResult } from '@/utils/interface'

export interface ModalEmit {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export interface PreviewInfo extends ImageReadResult {
  transform: string
}

function UploadModal(
  _: React.PropsWithChildren,
  ref: React.ForwardedRef<ModalEmit>
) {
  const [visible, setVisible] = useState<boolean>(false)
  const [images, setImages] = useState<ImageReadResult[]>([])
  const [bigImage, setBigImage] = useState<PreviewInfo | undefined>(undefined)
  const [previewList, setPreviewList] = useState<PreviewInfo[]>([])

  useImperativeHandle(
    ref,
    () => ({
      setVisible,
    }),
    []
  )

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
    setImages(images)
  }

  useEffect(() => {
    const maxList = images.length < 5 ? images : images.slice(0, 5)
    // 偏移角度
    const offsetDeg = 90 / 5
    // 开始角度
    const initDeg = (((maxList.length - 1) * offsetDeg) / 2) * -1
    const finalList: PreviewInfo[] = maxList.map((item, index) => {
      const deg = initDeg + index * offsetDeg
      return {
        ...item,
        transform: `rotate(${deg}deg)`,
      }
    })
    setBigImage(finalList.at(-1))
    setPreviewList(finalList)
  }, [images])

  return (
    <React.Fragment>
      <Popover visible={visible} title="弹窗">
        <div className="flex">
          <FilePick onChange={onPickChange}></FilePick>
          <div className="flex-1 flex flex-col ml-2">
            <div className="flex-1 flex flex-col items-center justify-center gap-2 border-b border-dashed border-bcolor">
              <div className="flex-1 flex items-center justify-center object-contain">
                {bigImage ? (
                  <Image
                    className="w-full"
                    src={`data:${bigImage.type};base64,${bigImage.base64}`}
                    width={bigImage.width}
                    height={bigImage.height}
                    alt={bigImage.name}></Image>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex items-center justify-between w-full pb-1">
                <p>{bigImage?.name}</p>
                <p>移除</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-14 h-20">
                {previewList.map(item => (
                  <Image
                    className="absolute top-0 left-0 w-full h-full object-cover origin-bottom rounded-sm shadow-md cursor-pointer"
                    style={{ transform: item.transform }}
                    src={`data:${item.type};base64,${item.base64}`}
                    width={item.width}
                    height={item.height}
                    alt={item.name}></Image>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Popover>
    </React.Fragment>
  )
}

export default forwardRef(UploadModal)
