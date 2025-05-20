'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hook'
import { setAccessToken, fetchUserInfo } from '@/store/user'
import octokit from '@/utils/Octokit'
import styles from './page.module.scss'

export default function Login() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [token, setToken] = useState<string>('')
  const [valid, setValide] = useState<boolean>(false)

  const handleChange = (e: React.BaseSyntheticEvent) => {
    const value = e.target.value
    setValide(!value)
    setToken(value)
  }

  const submit = async () => {
    if (!token) return setValide(true)
    // 初始化octokit实例
    octokit.initOctokit(token)
    // 获取用户信息
    const userInfo = await dispatch(fetchUserInfo())
    if (!userInfo) return
    dispatch(setAccessToken(btoa(token)))
    router.replace('/')
  }

  return (
    <div
      className={`${styles.login} fixed flex items-center justify-center w-screen h-screen`}>
      <div className="fixed top-20 left-0 p-2 pr-4 rounded-r-full leading-none bg-white">
        Image
      </div>
      <div className="w-72 min-h-max p-3 rounded bg-white">
        <form>
          <label className="form-item">
            <span className="form-item-label">Access Token</span>
            <input
              type="text"
              className="mt-1"
              placeholder="Your personal access token"
              required={valid}
              defaultValue={token}
              onChange={handleChange}
            />
            {valid ? (
              <p className="form-item-error-text">请填写 auth token</p>
            ) : (
              <></>
            )}
          </label>
          <button
            type="button"
            className={`${styles.button} w-full text-white`}
            onClick={submit}>
            连接
          </button>
        </form>
      </div>
    </div>
  )
}
