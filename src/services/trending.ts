import request, { gitFetch } from '@/utils/request'
import { STORAGEKEY } from '@const/storage'
import { getItem } from '@/utils/storage'
import type { Setting } from '@components/SettingPanel/index'
import type { WithNonNullable } from '@/type'
import dayjs from 'dayjs'
// public trending host by scan trending page
export const trendingHost = '//gh-trending.deno.dev'

function checkUseTrending(): boolean {
  const { useTrending = false } = getItem<Setting>(STORAGEKEY, {})
  return useTrending
}

function generateTrendingURI(url: string): string {
  return `${trendingHost}${url}`
}

function getCreateTime(since?: string): string {
  const format = 'YYYY-MM-DDTHH:mm:ss'
  const now = dayjs().startOf('day').format(format)
  // 必然是取前一天的(固定-1)
  const end = dayjs().startOf('day').add(-1, 'day').format(format)
  const prefix = 'created:'
  let range = ''
  if (!since || since === 'daily') {
    range = `${end}..${now}`
  } else {
    const start = dayjs()
      .startOf('day')
      .add(-1, since === 'weekly' ? 'week' : 'month')
      .format(format)

    range = `${start}..${now}`
  }

  return `${prefix}${range}`
}

export type GetRepositoriesPayload = {
  since?: string
  lang?: string
  spoken_language_code?: string
}

export type Owner = {
  username: string
  url: string
  avatar: string
}

export type RepositoryItem = {
  id: number
  full_name: string
  html_url: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string
  description: string
  languageColor: string
  starsSince: number
  builtBy: WithNonNullable<Owner>[]
}

export type Repositories = WithNonNullable<RepositoryItem>[]

export type TrendingRepoItem = {
  forks: number
  language: string
  description: string
  languageColor: string
  starsSince: number
  totalStars: number
  builtBy: WithNonNullable<Owner>[]
  repositoryName: string
  url: string
  username: string
}

export const getRepositories = (
  payload?: GetRepositoriesPayload
): Promise<Repositories> => {
  const useTrending = checkUseTrending()
  const { since, lang, spoken_language_code } = payload ?? {}
  if (useTrending) {
    const requestURI = lang
      ? `/repositories/${encodeURIComponent(lang)}`
      : '/repositories'
    const query = {
      since,
      spoken_language_code
    }
    const qs = `?${Object.entries(query)
      .filter((v) => v[1])
      .map((v) => v.join('='))
      .join('&')}`
    const url = generateTrendingURI(requestURI + qs)
    return gitFetch(url).then(async (res) => {
      try {
        const response = await res.json()
        return response.map(
          (
            {
              totalStars,
              url,
              username,
              repositoryName,
              forks,
              ...repo
            }: TrendingRepoItem,
            index: number
          ) => ({
            id: index,
            full_name: `${username}/${repositoryName}`,
            html_url: url,
            stargazers_count: totalStars,
            forks_count: forks,
            open_issues_count: 0,
            ...repo
          })
        )
      } catch (e) {
        console.log(e, res)
      }
      return []
    })
  }

  const createAt = getCreateTime(since)
  const language = lang ? `language:${lang} ` : ''

  return request()
    .search.repos({
      sort: 'stars',
      order: 'desc',
      q: `${language}${createAt}`,
      per_page: 25
    })
    .then(({ status, data }) => {
      if (status === 200) {
        return (
          data?.items?.map?.(
            ({
              id,
              full_name,
              html_url,
              stargazers_count,
              forks_count,
              open_issues_count,
              description,
              owner,
              language
            }) => ({
              id,
              full_name,
              html_url,
              stargazers_count,
              forks_count,
              open_issues_count,
              description,
              language,
              starsSince: stargazers_count,
              languageColor: 'purple.300',
              builtBy: [
                {
                  username: owner?.login ?? '',
                  avatar: owner?.avatar_url ?? '',
                  url: owner?.html_url ?? ''
                }
              ]
            })
          ) ?? []
        )
      }
      return []
    })
}
