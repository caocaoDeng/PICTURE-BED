import React, {
  ReactNode,
  CSSProperties,
  useRef,
  useState,
  useEffect,
} from 'react'
import { createPortal } from 'react-dom'
export default function Dropdown({
  title,
  placement,
  children,
}: {
  title: string | ReactNode
  placement: 'start' | 'end'
  children: ReactNode[]
}) {
  const elm = useRef<HTMLDivElement>(null)
  const popoverElm = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState<boolean>(false)
  const [popoverPos, setPopoverPos] = useState<CSSProperties>({})

  const handleVisible = () => setVisible(status => !status)

  const getOffsetInfo = () => {
    const {
      top = 0,
      left = 0,
      right = 0,
      bottom = 0,
      height = 0,
    } = elm.current?.getBoundingClientRect() || {}
    const { height: PopoverH = 0 } =
      popoverElm.current?.getBoundingClientRect() || {}
    const hAxis =
      placement === 'start' ? { left: `${left}px` } : { right: `${right}px` }
    const vAxis =
      bottom < PopoverH
        ? { bottom: `${bottom + height}px` }
        : { top: `${top + height}px` }
    setPopoverPos({ ...hAxis, ...vAxis })
  }

  useEffect(getOffsetInfo, [])

  return (
    <>
      <div ref={elm} className="dropdown">
        <div className="content" onClick={handleVisible}>
          {title || '下拉菜单'}
        </div>
        <span className="iconfont"></span>
      </div>
      {createPortal(
        <div
          ref={popoverElm}
          className={`popover absolute will-change-auto ${
            visible ? 'block' : 'hidden'
          }`}
          style={popoverPos}>
          <ul className="dropdown-menu">
            {children.map(node => (
              <li className="dropdown-menu-item">{node}</li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </>
  )
}
