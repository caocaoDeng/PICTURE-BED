import { Octokit } from 'octokit'
import { RequestMethod } from '@octokit/types'

class CreateOctokit {
  octokit: Octokit | null = null
  config = {
    accept: 'application/vnd.github+json',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }

  constructor() {
    const auth = ''
    this.initOctokit(auth)
  }
  initOctokit(auth: string) {
    if (!auth) return
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
