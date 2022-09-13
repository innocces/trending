import type { Item } from '@/type'
import { gitFetch } from '@/utils/request'

export const getLanguage: () => Promise<Item[]> = () => {
  return gitFetch('/resources/language.json')
}

export const getSpokenLanguage: () => Promise<Item[]> = () => {
  return gitFetch('/resources/spoken-lang.json')
}
