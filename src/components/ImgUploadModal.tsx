import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from 'react'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { setRepoContent, updateContent } from '@/store/repo'
import Popover from '@/components/Popover'
import FilePick from '@/components/FilePick'
import { onLoadImageInfo, readFile2ArrayBuffer, base642Image } from '@/utils'
import { ImageReadResult } from '@/utils/interface'
import { ActionType } from '@/store/interface'

export interface ModalEmit {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

export interface PreviewInfo extends ImageReadResult {
  deg: number
  zIndex: number
  duration: number
}

let config = {
  maxDeg: 90, // 展示的最大角度
  maxCount: 5, // 最大显示数量
  offsetDeg: 0, // 偏移角度
  startDeg: 0, // 旋转开始角度
  index: 0, // 下一张图片下标
  previewIndex: 0, // 预览图片的下标
}

function UploadModal(
  _: React.PropsWithChildren,
  ref: React.ForwardedRef<ModalEmit>
) {
  const dispatch = useAppDispatch()
  const { user, repo } = useAppSelector(store => store)

  const [visible, setVisible] = useState<boolean>(false)

  const [images, setImages] = useState<ImageReadResult[]>([])

  const [imgInfo, setImgInfo] = useState<PreviewInfo | undefined>(undefined)
  const [list, setList] = useState<PreviewInfo[]>([])

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
      const imageInfo = await onLoadImageInfo(base642Image(f.type, base64))
      images.push({
        name: f.name,
        type: f.type,
        base64,
        width: imageInfo.width,
        height: imageInfo.height,
      })
    }
    setImages(preValue => [...preValue, ...images])
  }

  const remove = () => {
    const finalList = images.filter(item => item.base64 !== imgInfo?.base64)
    setImages(finalList)
  }

  const init = () => {
    const { maxDeg, maxCount } = config
    const list = images.length < maxCount ? images : images.slice(-maxCount)
    // 偏移角度
    const offsetDeg = maxDeg / list.length
    // 开始角度
    const startDeg = (((list.length - 1) * offsetDeg) / 2) * -1
    const finalList: PreviewInfo[] = list.map((item, index) => {
      const deg = startDeg + index * offsetDeg
      return {
        ...item,
        deg,
        zIndex: index,
        duration: 200,
      }
    })
    config.startDeg = startDeg
    config.offsetDeg = offsetDeg
    config.index = images.length % list.length
    config.previewIndex = list.length - 1
    setList(finalList)
  }

  const loop = () => {
    const { offsetDeg, startDeg, index, previewIndex } = config
    const curIndex = index === 0 ? images.length - 1 : index - 1
    const curPreviewIndex =
      previewIndex === 0 ? list.length - 1 : previewIndex - 1
    const finalList = list.map(item => {
      const isRest = item.deg >= Math.abs(startDeg)
      return {
        ...item,
        deg: isRest ? startDeg : item.deg + offsetDeg,
        zIndex: isRest ? 0 : item.zIndex + 1,
        duration: isRest ? 0 : 200,
        base64: isRest ? images[curIndex].base64 : item.base64,
      }
    })
    config.index = curIndex
    config.previewIndex = curPreviewIndex
    setList(finalList)
  }

  const reset = () => {
    setVisible(false)
    setImages([])
    config = {
      maxDeg: 90,
      maxCount: 5,
      offsetDeg: 0,
      startDeg: 0,
      index: 0,
      previewIndex: 0,
    }
  }

  const submit = async () => {
    if (!images.length) return
    const wait = images.map(async ({ name, width, height, base64 }) => {
      const res = await dispatch(
        updateContent({
          fileName: `${width}X${height}^${name}`,
          content: base64,
        })
      )
      await dispatch(
        setRepoContent({ type: ActionType.JOIN, content: res.content })
      )
    })
    await Promise.all(wait)
    reset()
  }

  useEffect(() => {
    init()
  }, [images])

  useEffect(() => {
    setImgInfo(list[config.previewIndex])
  }, [list])

  return (
    <React.Fragment>
      <Popover
        visible={visible}
        title="上传图片"
        onClose={reset}
        onSubmit={submit}>
        <div className="flex">
          <div className="shrink">
            <FilePick onChange={onPickChange}></FilePick>
          </div>
          <div className="flex-1 flex flex-col min-w-0 ml-2">
            <div className="flex-1 flex flex-col items-center gap-2 min-h-0 border-b border-dashed border-bcolor">
              <div className="group relative flex-1 flex items-center justify-center min-h-0 w-full h-full">
                {imgInfo ? (
                  <>
                    <Image
                      className="w-full h-full object-contain rounded-sm"
                      src={base642Image(imgInfo.type, imgInfo.base64)}
                      width={imgInfo.width}
                      height={imgInfo.height}
                      alt={imgInfo.name}></Image>
                    <div className="absolute inset-0 rounded-sm text-white bg-mask hidden group-hover:block">
                      <span
                        className="iconfont icon-shanchu absolute inset-0 w-max h-max m-auto cursor-pointer"
                        onClick={remove}></span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="w-full pb-1 truncate">{imgInfo?.name}</div>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-14 h-20">
                {list.map((item, index) => (
                  <Image
                    className="absolute top-0 left-0 w-full h-full object-cover origin-bottom rounded-sm shadow-md cursor-pointer"
                    style={{
                      transform: `rotate(${item.deg}deg)`,
                      zIndex: item.zIndex,
                      transitionDuration: `${item.duration}ms`,
                    }}
                    key={index}
                    src={base642Image(item.type, item.base64)}
                    width={item.width}
                    height={item.height}
                    alt={item.name}
                    onClick={loop}></Image>
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
