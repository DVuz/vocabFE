import { apiGet, type ApiResponse } from '../../../shared/api'
import type { UserWordRow, VocabularyPayload } from '../types/vocabulary.types'

interface FetchVocabularyParams {
  page: number
  pageSize: number
  status?: string
}

export async function fetchVocabularyWords(params: FetchVocabularyParams) {
  const response = await apiGet<ApiResponse<UserWordRow[]>>('/user-words', {
    params,
  })

  const mappedPagination = response.pagination
    ? {
        total: response.pagination.total,
        page: response.pagination.page,
        pageSize: response.pagination.pageSize,
        totalPages: response.pagination.totalPages,
        hasNext: Boolean(response.pagination.hasNext),
        hasPrev: Boolean(response.pagination.hasPrev),
      }
    : {
        total: (response.data ?? []).length,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

  return {
    data: response.data ?? [],
    pagination: mappedPagination,
  } satisfies VocabularyPayload
}
