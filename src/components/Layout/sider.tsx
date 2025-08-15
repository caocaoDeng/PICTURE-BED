'use client'

import { useEffect, useRef, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { setRepoPath, setRepoContent, fetchRepoContent } from '@/store/repo'
import CreateCategory from '@/components/CreateCategory'
import ImgUploadModal, { ModalEmit } from '@/components/ImgUploadModal'
import { REPONAME } from '@/config'
import { ActionType } from '@/store/interface'
import { RepoContent } from '@/api/interface'

export default function Sider() {
  const dispatch = useAppDispatch()
  const { path, content } = useAppSelector(state => state.repo)
  const { isAction, checked } = useAppSelector(state => state.common)

  const categoryElm = useRef<ModalEmit>(null)
  const uploadModalElm = useRef<ModalEmit>(null)
  const [dirs, setDirs] = useState<RepoContent[]>([])
  const [pathIndex, setPathIndex] = useState<number | null>(null)

  const handleClick = async (dirPath: string, index: number) => {
    try {
      if (pathIndex !== null) return
      setPathIndex(index)
      const content = await dispatch(fetchRepoContent(path.concat(dirPath)))
      await dispatch(setRepoPath({ type: ActionType.JOIN, path: dirPath }))
      await dispatch(setRepoContent({ type: ActionType.REPLACE, content }))
    } finally {
      setPathIndex(null)
    }
  }

  useEffect(() => {
    const category = content.filter(item => item.type === 'dir')
    setDirs(category)
  }, [content])

  return (
    <nav className="flex flex-col w-64 h-full border-r border-bcolor text-sm text-foreground bg-background">
      <div className="px-2.5 pt-5 pb-2.5">
        <input
          type="text"
          className="border-0 bg-theme-gay"
          disabled
          defaultValue={REPONAME}
        />
      </div>

      <ul className="flex-1 px-2.5 overflow-auto">
        {dirs.length ? (
          dirs.map(({ name, path, sha }, index) => (
            <li
              key={index}
              onClick={() => handleClick(path, index)}
              className={`group flex items-center gap-3 p-2 mb-1 cursor-pointer rounded transition-all hover:bg-activeground hover:text-white ${
                pathIndex === index ? 'bg-activeground text-white' : ''
              }`}>
              <span className="iconfont icon-24gf-folder"></span>
              <span className="flex-1 truncate">{name}</span>
              {pathIndex ? (
                <div
                  className={`iconfont icon-loading1 ${
                    pathIndex === index
                      ? 'flex items-center w-4 h-4 animate-spin'
                      : 'hidden'
                  }`}></div>
              ) : (
                <div className="iconfont hidden group-hover:block"></div>
              )}
            </li>
          ))
        ) : (
          <li className="iconfont icon-kongshuju text-center mt-8 text-8xl!"></li>
        )}
      </ul>

      <div className="flex gap-3 p-2.5">
        <button onClick={() => categoryElm.current?.setVisible(true)}>
          新建目录
        </button>
        <button onClick={() => uploadModalElm.current?.setVisible(true)}>
          上传
        </button>
      </div>

      <ImgUploadModal ref={uploadModalElm}></ImgUploadModal>
      <CreateCategory ref={categoryElm}></CreateCategory>
    </nav>
  )
}
