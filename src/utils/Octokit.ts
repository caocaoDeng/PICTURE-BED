import { Octokit } from 'octokit'
import { RequestMethod } from '@octokit/types'
import type { UserState } from '@/store/interface'
import { USERINFO } from '@/store/const'

class CreateOctokit {
  octokit: Octokit | null = null
  config = {
    accept: 'application/vnd.github+json',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }
  initOctokit(auth?: string) {
    let userInfo: UserState | string | null = localStorage.getItem(USERINFO)
    if (!auth && !userInfo) return
    userInfo = JSON.parse(userInfo as string) as UserState
    auth = auth || userInfo.access_token
    this.octokit = new Octokit({
      auth,
      userAgent: 'PICTURE-BED(caocaoDeng)/v1.2.3',
    })
  }

  request<P, T>({
    method,
    url,
    params,
  }: {
    method: RequestMethod
    url: string
    params?: P
  }): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        !this.octokit && this.initOctokit()
        const res = await (this.octokit as Octokit).request(
          `${method} ${url}`,
          {
            ...this.config,
            ...(params || {}),
          }
        )
        resolve(res.data)
      } catch (error) {
        reject(error)
      }
    })
  }
}

const octokit = new CreateOctokit()
export default octokit
