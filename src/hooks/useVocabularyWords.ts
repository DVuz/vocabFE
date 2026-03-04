import { useQuery } from '@tanstack/react-query';
import type { Pagination, UserWordRow } from '../components/vocabulary/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

interface VocabularyParams {
  page: number;
  pageSize: number;
  status?: string;
  tab?: string;
  q?: string;
  token: string;
}

interface VocabularyData {
  data: UserWordRow[];
  pagination: Pagination;
}

export function useVocabularyWords({ page, pageSize, status, tab, q, token }: VocabularyParams) {
  return useQuery<VocabularyData>({
    queryKey: ['vocabulary', { page, pageSize, status, tab, q }],
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(status ? { status } : {}),
        ...(tab && tab !== 'all' ? { tab } : {}),
        ...(q ? { q } : {}),
      });
      const r = await fetch(`${API_BASE}/user-words?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message ?? 'Lỗi tải dữ liệu');
      return json.data as VocabularyData;
    },
    enabled: !!token,
    placeholderData: prev => prev,
  });
}
