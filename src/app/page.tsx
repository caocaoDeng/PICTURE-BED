'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hook'
import { fetchRepoContent } from '@/store/repo'
import Layout from '@/components/Layout'

export default function Home() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchRepoContent())
  }, [])

  return (
    <Layout>
      <h1>222</h1>
    </Layout>
  )
}
