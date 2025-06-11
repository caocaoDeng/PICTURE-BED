import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from './index'
import { REPONAME, ROOT } from '@/config'
import { SET_REPO_PATH, SET_REPO_CONTENT } from './const'
import { RepoContent } from '@/api/interface'
import { ActionType } from './interface'
import type {
  RepoContentAction,
  RepoPathAction,
  RepoState,
  User,
} from './interface'
import api from '@/api'

// 使用该类型定义初始 state
const initialState: RepoState = {
  name: REPONAME,
  path: [ROOT],
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
          state.path = [...state.path, path as string]
          break
        }

        case ActionType.SLICE: {
          state.path = path as string[]
          break
        }
      }
    },
    [SET_REPO_CONTENT]: (
      state,
      { payload }: PayloadAction<RepoContentAction>
    ) => {
      const { type, content } = payload
      switch (type) {
        case ActionType.JOIN: {
          state.content = [...state.content, content as RepoContent]
          break
        }

        case ActionType.REPLACE: {
          state.content = content as RepoContent[]
          break
        }
      }
    },
  },
})

export const { setRepoPath, setRepoContent } = userSlice.actions

export const fetchRepo = () => {
  return async (_: AppDispatch, getState: () => RootState) => {
    const { user, repo } = getState()
    return await api.getRepo({
      owner: (user.user as User).login,
      repo: repo.name,
    })
  }
}

export const createRepo = () => {
  return async (_: AppDispatch, getState: () => RootState) => {
    const { repo } = getState()
    return await api.createRepo({
      name: repo.name,
      description: 'picture manage',
      private: true,
    })
  }
}

export const fetchRepoContent = (path?: string[]) => {
  return async (_: AppDispatch, getState: () => RootState) => {
    const { user, repo } = getState()
    const fullPath = (path || repo.path).join('/').replace(/Root\/?/, '')
    return await api.getReposContent({
      owner: (user.user as User).login,
      repo: repo.name,
      path: fullPath,
    })
  }
}

export const updateContent = ({
  fileName,
  content,
}: {
  fileName: string
  content: Base64URLString
}) => {
  return async (_: AppDispatch, getState: () => RootState) => {
    const { user, repo } = getState()
    const { login, name, email } = user.user as User
    const path = repo.path.join('/').replace(/Root\/?/, '')
    return await api.updateContentByPath({
      owner: login,
      repo: repo.name,
      path: path ? `${path}/${fileName}` : fileName,
      message: '',
      committer: { name, email },
      content,
    })
  }
}

export const deleteContent = (contentPath: string, sha: string) => {
  return async (_: AppDispatch, getState: () => RootState) => {
    const { user, repo } = getState()
    const { login, name, email } = user.user as User
    const path = repo.path.join('/').replace(/Root\/?/, '')
    return await api.updateContentByPath({
      owner: login,
      repo: repo.name,
      path: path ? `${path}/${contentPath}` : contentPath,
      message: '',
      committer: { name, email },
      sha,
    })
  }
}

export default userSlice.reducer
