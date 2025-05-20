import Image from 'next/image'
import { useAppSelector } from '@/store/hook'

export default function Header() {
  const { user } = useAppSelector(store => store.user)
  const { path } = useAppSelector(store => store.repo)

  return (
    <header className="flex shrink-0 h-16 items-center border-b">
      <h1 className="flex items-center w-64 pl-2.5 text-xl font-semibold shrink-0">
        PICTURE BED
      </h1>
      <ul className="flex-1 flex">
        {path.map((item, index) => (
          <li key={index}>{item}</li>
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
