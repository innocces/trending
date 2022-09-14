import { Octokit } from 'octokit'
import type { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types'
import { STORAGEKEY } from '@const/storage'
import { getItem } from '@/utils/storage'
import type { Setting } from '@components/SettingPanel/index'
import 'isomorphic-fetch'

function request(): RestEndpointMethods {
  const { token } = getItem<Setting>(STORAGEKEY, {})
  const octokit = new Octokit(token ? { auth: token } : {})
  return octokit.rest
}

export default request

export function gitFetch(
  input: RequestInfo | URL,
  init?: RequestInit & { needToken?: boolean }
) {
  const { token } = getItem<Setting>(STORAGEKEY, {})
  const { needToken, ...requestInit } = init ?? {}
  if (token) {
    init = {
      ...(requestInit ?? {}),
      headers: {
        ...(requestInit?.headers ?? {}),
        ...(needToken ? { Authorization: `Bearer ${token}` } : {})
      },
      mode: 'cors'
    }
  }
  return fetch(input, init)
}
