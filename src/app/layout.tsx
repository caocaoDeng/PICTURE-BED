'use client'

// import type { Metadata } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import store from '@/store'
import { setAccessToken, setUserInfo } from '@/store/user'
import { Provider } from 'react-redux'
import { USERINFO } from '@/store/const'
import { User, UserState } from '@/store/interface'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// export const metadata: Metadata = {
//   title: '小草',
//   description: 'picture bed for use github rest api',
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  const permissionAuth = async () => {
    const userInfo = localStorage.getItem(USERINFO)
    // 本地不存在用户信息重定向登录页面
    if (!userInfo) router.push('/login')
    const storeUser = store.getState().user.user
    if (storeUser) return
    // 仓库不存在用户信息 重新设置
    const { access_token, user } = JSON.parse(userInfo as string) as UserState
    await store.dispatch(setAccessToken(atob(access_token)))
    await store.dispatch(setUserInfo(user as User))
  }

  useEffect(() => {
    permissionAuth()
  }, [router])

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  )
}
