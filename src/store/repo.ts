import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from './index'
import { REPONAME } from '@/config'
import { SET_REPO_PATH, SET_REPO_CONTENT } from './const'
import type { RepoPathAction, RepoState, User } from './interface'
import { ActionType } from './interface'
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
    [SET_REPO_PATH]: (state, { payload }: PayloadAction<RepoPathAction>) => {
      const { type, path } = payload
      switch (type) {
        case ActionType.JOIN: {
          state.path.push(path as string)
          break
        }

        case ActionType.SLICE: {
          state.path = [...(path as string[])]
          break
        }
      }
    },
    [SET_REPO_CONTENT]: (state, action: PayloadAction<RepoContent[]>) => {
      state.content = action.payload
    },
  },
})

export const { setRepoPath, setRepoContent } = userSlice.actions

export const fetchRepo = () => {
  return async (_: AppDispatch, getState: () => RootState) => {
    const { user } = getState()
    return await api.getRepo({
      owner: (user.user as User).login,
      repo: REPONAME,
    })
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
    const { user, repo } = getState()
    const res = await api.getReposContent({
      owner: (user.user as User).login,
      repo: REPONAME,
      path: repo.path.join('').replace(/Root/, ''),
    })
    dispatch(setRepoContent(res))
  }
}

export default userSlice.reducer
