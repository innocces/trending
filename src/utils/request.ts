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

export function gitFetch(input: RequestInfo | URL, init?: RequestInit) {
  const { token } = getItem<Setting>(STORAGEKEY, {})
  if (token) {
    init = {
      ...(init ?? {}),
      headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
      mode: 'no-cors'
    }
  }
  return fetch(input, init).then(async (res) => {
    let response = res
    try {
      response = await res.json()
    } catch (e) {
      console.log(e)
    }
    return response
  })
}
