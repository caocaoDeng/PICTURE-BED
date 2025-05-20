'use client'

// import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import store from '@/store'
import { Provider } from 'react-redux'
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  )
}
