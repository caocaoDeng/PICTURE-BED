import { RepoContent } from '@/api/interface'
export interface User {
  id: number
  login: string
  name: string
  avatar_url: string
  bio: string
  email: string
}

export interface UserState {
  access_token: string
  user: User | null
}

export interface RepoState {
  name: string
  path: string[]
  content: RepoContent[]
}

export enum ActionType {
  JOIN = 'join',
  SLICE = 'slice',
  REPLACE = 'replace',
}

export interface RepoPathAction {
  type: ActionType.JOIN | ActionType.SLICE
  path: string | string[]
}

export interface RepoContentAction {
  type: ActionType.JOIN | ActionType.REPLACE
  content: RepoContent | RepoContent[]
}
