// 获取 repo 的参数
export interface QueryRepo {
  owner: string
  repo: string
}

// 创建 repo 的参数
export interface CreateRepo {
  name: string
  description?: string
  private?: boolean
}

export interface ContentParams {
  owner: string
  repo: string
  path: string
}

// 获取 repos 返回的信息
export interface RepoContent {
  name: string
  path: string
  sha: string
  type: 'file' | 'dir'
  html_url: string
  download_url: string
}

export interface WaterData extends RepoContent {
  width: number
  height: number
  itemW?: number
  itemH?: number
  offsetX?: number
  offsetY?: number
}

export interface Committer {
  name: string
  email: string
}

/**
 * 更新/获取 repos content 的参数
 * 更新时 content committer 必传
 */
export interface UpdateRepoParams {
  sha?: string
  // username
  owner: string
  // 仓库名称
  repo: string
  // 更新路径
  path: string
  // 提交信息
  message?: string
  // 提交内容 base64
  content?: string
  // 提交人
  committer?: Committer
}

export interface UpdateRepoResult {
  commiter: object
  content: RepoContent
}
