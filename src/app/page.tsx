'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { fetchRepoContent } from '@/store/repo'
import Layout from '@/components/Layout'
import WaterFall from '@/components/WaterFall'
import { download } from '@/utils'
import type { WaterData } from '@/api/interface'

const actions = [
  {
    type: 'copy',
    icon: 'icon-fuzhi',
  },
  {
    type: 'download',
    icon: 'icon-xiazai',
  },
] as const

export type Action = (typeof actions)[number]['type']

export default function Home() {
  const dispatch = useAppDispatch()

  const { user, repo } = useAppSelector(state => state)

  const getImageData = () => {
    return repo.content
      .filter(item => item.type === 'file')
      .map(item => {
        const [sizeStr, fileName] = item.name.split('^')
        const [width, height] = sizeStr.split('X').map(item => +item)
        return {
          ...item,
          name: fileName,
          width,
          height,
        }
      })
  }

  const handleAction = async (type: Action, item: WaterData) => {
    switch (type) {
      case 'download': {
        return download(item.name, item.download_url)
      }

      case 'copy': {
        return await navigator.clipboard.writeText(item.download_url)
      }
    }
  }

  useEffect(() => {
    user.user && dispatch(fetchRepoContent())
  }, [user])

  return (
    <Layout>
      <WaterFall
        data={getImageData()}
        itemMaxW={200}
        gap={10}
        actions={actions}
        dispatchAction={handleAction}></WaterFall>
    </Layout>
  )
}
