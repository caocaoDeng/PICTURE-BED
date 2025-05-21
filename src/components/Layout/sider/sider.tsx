'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { setRepoPath, fetchRepoContent } from '@/store/repo'
import { REPONAME } from '@/config'
import { ActionType } from '@/store/interface'

export default function Sider() {
  const dispatch = useAppDispatch()
  const { content } = useAppSelector(state => state.repo)

  const [pathIndex, setPathIndex] = useState<number | null>(null)

  const dirList = () => {
    return content.filter(item => item.type === 'dir')
  }

  const handleClick = async (path: string, index: number) => {
    if (pathIndex !== null) return
    setPathIndex(index)
    await dispatch(setRepoPath({ type: ActionType.JOIN, path }))
    await dispatch(fetchRepoContent())
    setPathIndex(null)
  }

  return (
    <nav className="flex flex-col w-64 h-full border-r text-sm">
      <div className="px-2.5 pt-5 pb-2.5">
        <input
          type="text"
          className="border-0"
          disabled
          defaultValue={REPONAME}
        />
      </div>
      <ul className="flex-1 px-2.5 overflow-auto">
        {dirList().map(({ name, path }, index) => (
          <li
            key={index}
            onClick={() => handleClick(path, index)}
            className={`flex items-center gap-3 p-2 mb-1 cursor-pointer rounded transition-all hover:bg-activeground hover:text-white ${
              pathIndex === index ? 'bg-activeground text-white' : ''
            }`}>
            <span className="iconfont icon-24gf-folder"></span>
            <span className="flex-1 truncate">{name}</span>
            <div
              className={`iconfont icon-loading1 ${
                pathIndex === index
                  ? 'flex items-center w-4 h-4 animate-spin'
                  : 'hidden'
              }`}></div>
          </li>
        ))}
      </ul>
      <div className="flex gap-3 p-2.5">
        <input
          type="text"
          placeholder="搜索分类"
          className="flex-1 px-2.5 py-1.5 rounded-full border-0 indent-2 focus:border-0 focus:ring-0 placeholder:text-xs"
        />
        <div className="flex gap-2">
          <button>新建目录</button>
          <button>上传</button>
        </div>
      </div>
    </nav>
  )
}
