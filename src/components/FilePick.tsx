import { useRef } from 'react'

export default function FilePick({
  children,
  onChange,
}: {
  children?: React.ReactNode
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const inputEle = useRef<HTMLInputElement>(null)

  const triggerPick = () => inputEle.current?.click()

  return (
    <div
      className="com-upload flex flex-col items-center justify-center w-72 h-72 border border-dashed border-bcolor rounded cursor-pointer hover:border-foreground hover:text-foreground!"
      onClick={triggerPick}>
      {children || (
        <>
          <i
            className="iconfont icon-tuya- leading-none text-bcolor"
            style={{ fontSize: '64px' }}></i>
          <span className="text-bcolor">选择文件</span>
        </>
      )}
      <input
        ref={inputEle}
        multiple
        className="hidden"
        type="file"
        accept="image/*"
        onChange={e => onChange && onChange(e)}
      />
    </div>
  )
}
