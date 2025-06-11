import { createSlice } from '@reduxjs/toolkit'
import { CommonState } from './interface'

// 使用该类型定义初始 state
const initialState: CommonState = {
  isAction: true,
  checked: [],
}

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    tiggetIsAction: state => {
      state.isAction = !state.isAction
    },
  },
})

export const { tiggetIsAction } = commonSlice.actions

export default commonSlice.reducer
