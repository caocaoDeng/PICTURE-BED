import octokit from '@/utils/Octokit'
import { User } from '@/store/interface'
import {
  QueryRepo,
  CreateRepo,
  ContentParams,
  RepoContent,
  UpdateRepoParams,
  UpdateRepoResult,
} from './interface'

const api = {
  // 获取用户信息
  getUserInfo() {
    return octokit.request<undefined, User>({
      method: 'GET',
      url: '/user',
    })
  },

  // 获取仓库信息
  getRepo(params: QueryRepo) {
    return octokit.request<QueryRepo, number>({
      method: 'GET',
      url: `/repos/${params.owner}/${params.repo}`,
      params,
    })
  },

  // 创建repo
  createRepo(params: CreateRepo) {
    return octokit.request<CreateRepo, number>({
      method: 'POST',
      url: '/user/repos',
      params,
    })
  },

  // 获取repo内容
  getReposContent({ owner, repo, path }: ContentParams) {
    return octokit.request<ContentParams, RepoContent[]>({
      method: 'GET',
      url: `/repos/${owner}/${repo}/contents/${path}`,
    })
  },

  // 更新内容
  updateContentByPath(params: UpdateRepoParams) {
    const { owner, repo, path } = params
    return octokit.request<UpdateRepoParams, UpdateRepoResult>({
      method: 'PUT',
      url: `/repos/${owner}/${repo}/contents/${path}`,
      params: {
        ...params,
        message: 'update resourse',
      },
    })
  },

  // 删除内容
  deleteContentByPath(params: UpdateRepoParams) {
    const { owner, repo, path } = params
    return octokit.request<UpdateRepoParams, any>({
      method: 'DELETE',
      url: `/repos/${owner}/${repo}/contents/${path}`,
      params: {
        ...params,
      },
    })
  },
}

export default api
