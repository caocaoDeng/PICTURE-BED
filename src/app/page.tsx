'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { fetchRepoContent } from '@/store/repo'
import Layout from '@/components/Layout'
import WaterFall from '@/components/WaterFall'

export default function Home() {
  const dispatch = useAppDispatch()

  const { user, repo } = useAppSelector(state => state)

  const getImageData = () => {
    return repo.content
      .filter(item => item.type === 'file')
      .map(item => {
        const [sizeStr, fileName] = item.name.split('_')
        const [width, height] = sizeStr
          .split('&')
          .map(item => +item.split('=')[1])
        return {
          ...item,
          name: fileName,
          width,
          height,
        }
      })
  }

  useEffect(() => {
    user.user && dispatch(fetchRepoContent())
  }, [user])

  return (
    <Layout>
      7777
      {/* <WaterFall data={getImageData()} itemMaxW={200} gap={10}></WaterFall> */}
    </Layout>
  )
}
