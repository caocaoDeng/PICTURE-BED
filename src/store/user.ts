import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from './index'
import { USERINFO, SET_AUTH_TOKEN, SET_USER_INFO } from './const'
import api from '@/api'

interface UserState {
  auth_token: string
  user: null
}

// 使用该类型定义初始 state
const initialState: UserState = {
  auth_token: '',
  user: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    [SET_AUTH_TOKEN]: (state, action: PayloadAction<string>) => {
      state.auth_token = action.payload
    },
    [SET_USER_INFO]: (state, action: PayloadAction<null>) => {
      state.user = action.payload
    },
  },
})

export const { setAuthToken, setUserInfo } = userSlice.actions

export const fetchUserInfo = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { user } = getState()
    const res = await api.getUserInfo()
    if (!res) return
    const userInfo = JSON.stringify({ ...user, user: res })
    localStorage.setItem(USERINFO, userInfo)
    dispatch(setUserInfo(res))
  }
}

export default userSlice.reducer
