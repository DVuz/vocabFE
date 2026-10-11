import { apiGet, type ApiResponse } from '../../../shared/api'
import type { WordList, WordListItem } from '../types/word-list.types'

export async function fetchWordLists() {
  const response = await apiGet<ApiResponse<WordList[]>>('/my/word-lists')
  return response.data ?? []
}

export async function fetchWordListItems(listId: number) {
  const response = await apiGet<ApiResponse<WordListItem[]>>(`/my/word-list-iterms/list/${listId}`)
  return response.data ?? []
}
