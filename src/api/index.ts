import octokit from '@/utils/Octokit'
import { User } from '@/store/interface'
import { QueryRepo, CreateRepo, ContentParams, RepoContent } from './interface'

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

  // // 更新内容
  // updateReposContent(params: UpdateReposParams) {
  //   const { owner, repo, path } = params
  //   return octokit.request<{
  //     content: ReposContent
  //   }>('PUT', `/repos/${owner}/${repo}/contents/${path}`, {
  //     ...params,
  //     message: 'update resourse',
  //   })
  // },
}

export default api
