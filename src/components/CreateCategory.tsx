import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { useAppDispatch } from '@/store/hook'
import { updateContent, setRepoContent } from '@/store/repo'
import Popover from '@/components/Popover'
import { defaultImg } from '@/config'
import { ActionType } from '@/store/interface'
import { RepoContent } from '@/api/interface'

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
    const res = await dispatch(
      updateContent({
        fileName: `${name}/200X200^favicon.ico`,
        content: defaultImg,
      })
    )
    const dirName = res.content.path.split('/')[0]
    const file2Dir: RepoContent = {
      ...res.content,
      type: 'dir',
      name: dirName,
      path: dirName,
      download_url: '',
    }
    await dispatch(setRepoContent({ type: ActionType.JOIN, content: file2Dir }))
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
