import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch } from './index'
import type { User, UserState } from './interface'
import { USERINFO, SET_ACCESS_TOKEN, SET_USER_INFO } from './const'
import api from '@/api'

// 使用该类型定义初始 state
const initialState: UserState = {
  access_token: '',
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    [SET_ACCESS_TOKEN]: (state, action: PayloadAction<string>) => {
      state.access_token = action.payload
      // 将用户信息保存到本地
      const userInfo = JSON.stringify({
        ...state,
        access_token: action.payload,
      })
      localStorage.setItem(USERINFO, userInfo)
    },
    [SET_USER_INFO]: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      // 将用户信息保存到本地
      const userInfo = JSON.stringify({ ...state, user: action.payload })
      localStorage.setItem(USERINFO, userInfo)
    },
  },
})

export const { setAccessToken, setUserInfo } = userSlice.actions

export const fetchUserInfo = () => {
  // getState: () => RootState
  return async (dispatch: AppDispatch) => {
    const res = await api.getUserInfo()
    if (!res) return
    await dispatch(
      setUserInfo({
        id: res.id,
        login: res.login,
        name: res.name,
        avatar_url: res.avatar_url,
        bio: res.bio,
        email: res.email,
      })
    )
    return res
  }
}

export default userSlice.reducer
