import { createSlice } from '@reduxjs/toolkit'
import { CommonState } from './interface'

// 使用该类型定义初始 state
const initialState: CommonState = {
  theme: 'light',
  isAction: true,
  checked: [],
}

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setTheme: state => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    tiggetIsAction: state => {
      state.isAction = !state.isAction
    },
  },
})

export const { setTheme, tiggetIsAction } = commonSlice.actions

export default commonSlice.reducer
