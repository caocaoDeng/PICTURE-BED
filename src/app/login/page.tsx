'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hook'
import { setAccessToken, fetchUserInfo } from '@/store/user'
import octokit from '@/utils/Octokit'

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
      className="fixed flex items-center justify-center w-screen h-screen"
      style={{
        backgroundImage:
          'linear-gradient(to left bottom, #21413f, #1c3636, #182c2d, #142223, #10191a, #0d1517, #091113, #050c0e, #060f11, #071115, #081317, #09151a)',
      }}>
      <div className="fixed top-20 left-0 p-2 pr-4 rounded-r-full leading-none bg-white">
        Image
      </div>
      <div className="w-72 min-h-max p-3 rounded bg-white">
        <form>
          <label className="form-item">
            <span className="form-item-label">Access Token</span>
            <input
              type="password"
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
          <button type="button" className="w-full text-white" onClick={submit}>
            连接
          </button>
        </form>
      </div>
    </div>
  )
}
