'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { setAuthToken, fetchUserInfo } from '@/store/user'
import styles from './page.module.scss'

export default function Login() {
  const router = useRouter()
  const user = useAppSelector(state => state.user.user)
  const dispatch = useAppDispatch()

  const [token, setToken] = useState<string>('')
  const [isEmpty, setIsEmpty] = useState<boolean>(false)

  const handleChange = (e: React.BaseSyntheticEvent) => {
    const value = e.target.value
    setIsEmpty(!value)
    setToken(value)
  }

  const submit = async () => {
    if (!token) return setIsEmpty(true)
    await dispatch(fetchUserInfo())
    if (!user) return
    dispatch(setAuthToken(btoa(token)))
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
            <span className="label">Auth Token</span>
            <input
              type="text"
              className="mt-1"
              required={isEmpty}
              defaultValue={token}
              onChange={handleChange}
            />
            {isEmpty ? <p className="error">请填写 auth token</p> : <></>}
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
