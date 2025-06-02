import React from 'react'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { fetchRepoContent, setRepoPath, setRepoContent } from '@/store/repo'
import { ActionType } from '@/store/interface'

export default function Header() {
  const dispatch = useAppDispatch()

  const { user } = useAppSelector(store => store.user)
  const { path } = useAppSelector(store => store.repo)

  const handleEntryPath = async (index: number) => {
    if (index === path.length - 1) return
    const entryPath = path.slice(0, index + 1)
    const content = await dispatch(fetchRepoContent(entryPath))
    await dispatch(setRepoPath({ type: ActionType.SLICE, path: entryPath }))
    await dispatch(setRepoContent({ type: ActionType.REPLACE, content }))
  }

  return (
    <header className="flex shrink-0 h-16 items-center border-b border-bcolor">
      <h1 className="flex items-center w-64 pl-2.5 text-xl font-semibold shrink-0 cursor-pointer">
        <Image src="/favicon.ico" width={30} height={30} alt="logo"></Image>
        <span className="ml-2">PICTURE BED</span>
      </h1>
      <ul className="flex-1 flex gap-2">
        {path.map((item, index) => (
          <React.Fragment key={index}>
            {!!index ? <li>/</li> : <></>}
            <li
              className="cursor-pointer font-bold"
              onClick={() => handleEntryPath(index)}>
              {item}
            </li>
          </React.Fragment>
        ))}
      </ul>
      <div className="flex flex-nowrap items-center gap-2 pr-2.5">
        <div className="flex items-center gap-2">
          <Image
            className="rounded-full"
            src={user ? user.avatar_url : '/user.png'}
            width={24}
            height={24}
            alt="avatar"
          />
          <span className="text-xs">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
