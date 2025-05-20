import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from './index'
import type { RepoState } from './interface'
import { REPONAME } from '@/config'
import { SET_REPO_PATH, SET_REPO_CONTENT } from './const'
import { RepoContent } from '@/api/interface'
import api from '@/api'

// 使用该类型定义初始 state
const initialState: RepoState = {
  name: REPONAME,
  path: ['Root'],
  content: [],
}

export const userSlice = createSlice({
  name: 'repo',
  initialState,
  reducers: {
    [SET_REPO_PATH]: (state, action: PayloadAction<string>) => {
      state.path.push(action.payload)
    },
    [SET_REPO_CONTENT]: (state, action: PayloadAction<RepoContent[]>) => {
      state.content = action.payload
    },
  },
})

export const { setRepoPath, setRepoContent } = userSlice.actions

export const fetchRepo = () => {
  return async () => {
    return await api.getRepo({ owner: 'caocaoDeng', repo: REPONAME })
  }
}

export const createRepo = () => {
  return async () => {
    return await api.createRepo({
      name: REPONAME,
      description: 'picture manage',
      private: true,
    })
  }
}

export const fetchRepoContent = () => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { repo } = getState()
    const res = await api.getReposContent({
      owner: 'caocaoDeng',
      repo: 'UELDVFVSRS1CRUQ-',
      path: repo.path.join('').replace(/Root/, ''),
    })
    dispatch(setRepoContent(res))
  }
}

export default userSlice.reducer
