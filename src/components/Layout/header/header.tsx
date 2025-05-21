import React from 'react'
import Image from 'next/image'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { fetchRepoContent, setRepoPath } from '@/store/repo'
import { ActionType } from '@/store/interface'

export default function Header() {
  const dispatch = useAppDispatch()

  const { user } = useAppSelector(store => store.user)
  const { path } = useAppSelector(store => store.repo)

  const handleEntryPath = async (index: number) => {
    if (index === path.length - 1) return
    const entryPath = path.slice(0, index + 1)
    await dispatch(setRepoPath({ type: ActionType.SLICE, path: entryPath }))
    await dispatch(fetchRepoContent())
  }

  return (
    <header className="flex shrink-0 h-16 items-center border-b">
      <h1 className="flex items-center w-64 pl-2.5 text-xl font-semibold shrink-0">
        PICTURE BED
      </h1>
      <ul className="flex-1 flex">
        {path.map((item, index) => (
          <React.Fragment key={index}>
            {!!index ? <li>/</li> : <></>}
            <li onClick={() => handleEntryPath(index)}>{item}</li>
          </React.Fragment>
        ))}
      </ul>
      <div className="flex flex-nowrap items-center gap-2 pr-2.5">
        <Image
          src={user ? user.avatar_url : '/user.png'}
          width={24}
          height={24}
          alt="avatar"
        />
      </div>
    </header>
  )
}
