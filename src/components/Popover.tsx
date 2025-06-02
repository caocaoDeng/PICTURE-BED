/**
 * Popover 全局属性
 * https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Global_attributes/popover
 */
import React, { useEffect, useRef, useState } from 'react'

export interface Popover {
  mask?: boolean
  closable?: boolean
  visible: boolean
  title: string
  children?: React.ReactNode
  onClose?: () => void
  onSubmit?: () => void
}

export default function Popover({
  mask = true,
  closable = true,
  visible,
  title,
  children,
  onClose,
  onSubmit,
}: Popover) {
  const popoverElm = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      onSubmit && (await onSubmit())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    popoverElm.current?.togglePopover()
  }, [visible])

  return visible ? (
    <div className={`fixed inset-0 z-50 ${mask ? 'bg-mask' : ''}`}>
      <div
        ref={popoverElm}
        popover="manual"
        className="rounded-lg m-auto"
        style={{ width: '32rem' }}>
        <header className="flex items-center justify-between px-4 py-3.5 border-b border-bcolor">
          <h3 className="flex-1 font-medium truncate">{title}</h3>
          {closable ? (
            <span
              className="iconfont icon-close leading-none cursor-pointer text-zinc-400 hover:text-zinc-500"
              onClick={() => onClose && onClose()}></span>
          ) : (
            <></>
          )}
        </header>
        <main className="p-4 text-sm">{children}</main>
        <footer className="flex items-center justify-end gap-4 px-4 py-3 border-t border-bcolor">
          <button
            className="bg-transparent text-foreground"
            onClick={() => onClose && onClose()}>
            取消
          </button>
          <button
            className="flex items-center gap-1"
            disabled={loading}
            onClick={handleSubmit}>
            <span
              className={`w-4 h-4 animate-spin iconfont icon-loading1 ${
                loading ? 'flex items-center' : 'hidden'
              }`}></span>
            <span>确定</span>
          </button>
        </footer>
      </div>
    </div>
  ) : (
    <></>
  )
}
