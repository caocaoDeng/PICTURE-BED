import octokit from '@/utils/Octokit'
// import {
//   User,
//   IRepositoriesParams,
//   Repository,
//   CreateReposParams,
//   ReposContent,
//   UpdateReposParams,
// } from './interface'

const api = {
  // 获取用户信息
  getUserInfo() {
    return octokit.request<null, null>({
      method: 'GET',
      url: '/user',
    })
  },

  // // 获取repos列表
  // getUserRepositories(params: IRepositoriesParams) {
  //   return octokit.request<Repository[]>(
  //     'GET',
  //     `/users/${params.username}/repos`,
  //     params
  //   )
  // },

  // // 创建repo
  // createRepository(params: CreateReposParams) {
  //   return octokit.request<Repository>('POST', '/user/repos', params)
  // },

  // // 获取repo内容
  // getReposContent({ owner, repo, path }: UpdateReposParams) {
  //   return octokit.request<ReposContent[] | ReposContent>(
  //     'GET',
  //     `/repos/${owner}/${repo}/contents/${path}`
  //   )
  // },

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
