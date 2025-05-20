'use client'

import { useAppSelector, useAppDispatch } from '@/store/hook'
import { setRepoPath, fetchRepoContent } from '@/store/repo'
import { REPONAME } from '@/config'

export default function Sider() {
  const dispatch = useAppDispatch()

  const { content } = useAppSelector(state => state.repo)

  const dirList = () => {
    return content.filter(item => item.type === 'dir')
  }

  const handleClick = async (path: string) => {
    await dispatch(setRepoPath(`/${path}`))
    await dispatch(fetchRepoContent())
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
            onClick={() => handleClick(path)}
            className="flex items-center gap-3 p-2 mb-1 cursor-pointer rounded transition-all hover:bg-activeground hover:text-white">
            <span className="iconfont icon-24gf-folder">icon</span>
            <span className="flex-1 truncate">{name}</span>
            <span>*</span>
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
