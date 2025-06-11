'use client'

import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import {
  createRepo,
  fetchRepo,
  fetchRepoContent,
  setRepoContent,
} from '@/store/repo'
import Layout from '@/components/Layout'
import WaterFall from '@/components/WaterFall'
import { download } from '@/utils'
import type { WaterData } from '@/api/interface'
import { ActionType } from '@/store/interface'

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

  const { user, repo, common } = useAppSelector(state => state)
  const [images, setImages] = useState<WaterData[]>([])

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
    const repoImageFiles = repo.content
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
    setImages(repoImageFiles)
  }, [repo.content])

  const getData = async () => {
    try {
      await dispatch(fetchRepo())
      const content = await dispatch(fetchRepoContent())
      await dispatch(setRepoContent({ type: ActionType.REPLACE, content }))
    } catch (error: any) {
      // 不存在自动创建目录
      if (/Not Found/.test(error.message)) {
        await dispatch(createRepo())
      }
    }
  }

  useEffect(() => {
    user.user && getData()
  }, [user])

  return (
    <div className={`${common.theme}`}>
      <Layout>
        {images.length ? (
          <WaterFall
            data={images}
            itemMaxW={200}
            gap={10}
            actions={actions}
            dispatchAction={handleAction}></WaterFall>
        ) : (
          <div className="iconfont icon-kongshuju relative top-1/2 left-1/2 -translate-1/2 w-max text-8xl!"></div>
        )}
      </Layout>
    </div>
  )
}
