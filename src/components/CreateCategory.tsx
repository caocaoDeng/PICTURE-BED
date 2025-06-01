import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useAppDispatch } from '@/store/hook'
import { fetchRepoContent, updateContent } from '@/store/repo'
import Popover from '@/components/Popover'
import { defaultImg } from '@/config'

export interface ModalEmit {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

function UploadModal(
  _: React.PropsWithChildren,
  ref: React.ForwardedRef<ModalEmit>
) {
  const dispatch = useAppDispatch()

  const [visible, setVisible] = useState<boolean>(false)

  const [required, setRequired] = useState<boolean>(false)
  const [name, setName] = useState<string>('')

  const onChange = (e: React.BaseSyntheticEvent) => {
    const value = e.target.value
    setRequired(!value)
    setName(value)
  }

  const handleReset = () => {
    setName('')
    setRequired(false)
    setVisible(false)
  }

  const handleSubmit = async () => {
    if (!name) return setRequired(true)
    await dispatch(
      updateContent({
        fileName: `${name}/200X200^favicon.ico`,
        content: defaultImg,
      })
    )
    await dispatch(fetchRepoContent())
    handleReset()
  }

  useImperativeHandle(
    ref,
    () => ({
      setVisible,
    }),
    []
  )

  return (
    <Popover
      visible={visible}
      title="创建分类"
      onClose={handleReset}
      onSubmit={handleSubmit}>
      <form>
        <label className="form-item">
          <span className="form-item-label">分类</span>
          <input
            className="mt-1"
            placeholder="分类名称"
            required={required}
            defaultValue={name}
            onChange={onChange}
          />
          {required ? (
            <p className="form-item-error-text">请输入分类名称</p>
          ) : (
            <></>
          )}
        </label>
      </form>
    </Popover>
  )
}

export default forwardRef(UploadModal)
