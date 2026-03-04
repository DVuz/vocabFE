import { useQuery } from '@tanstack/react-query';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export interface ReviewCard {
  userWordId: number;
  wordId: number;
  word: string;
  meaningId: number;
  partOfSpeech?: string | null;
  cefrLevel?: string | null;
  definition: string;
  vnDefinition?: string | null;
  examples: string[];
  ipa: { uk?: string | null; us?: string | null };
  audio: { uk?: string | null; us?: string | null };
  status?: string | null;
  currentStreak?: number | null;
  intervalDays?: number | null;
  nextReviewAt?: string | null;
}

export interface ReviewSessionSummary {
  id: number;
  sessionType: string | null;
  totalQuestions: number | null;
  correctAnswers: number | null;
  incorrectAnswers: number | null;
  scorePercent: number | null;
  durationSeconds: number | null;
  status: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface ReviewSessionItem {
  id: number;
  userWordId: number;
  word: string;
  definition: string;
  partOfSpeech: string | null;
  cefrLevel: string | null;
  isCorrect: boolean | null;
  questionType: string | null;
  streakBefore: number | null;
  streakAfter: number | null;
  easeAfter: number | null;
}

export interface ReviewSessionDetail extends ReviewSessionSummary {
  items: ReviewSessionItem[];
}

export function useReviewQueue(token: string) {
  return useQuery<ReviewCard[]>({
    queryKey: ['review', 'today'],
    queryFn: async ({ signal }) => {
      const r = await fetch(`${API_BASE}/review/today`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message ?? 'Lỗi tải dữ liệu');
      return json.data as ReviewCard[];
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}

export function useReviewSessions(token: string, page = 1) {
  return useQuery<{
    data: ReviewSessionSummary[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>({
    queryKey: ['review', 'sessions', page],
    queryFn: async ({ signal }) => {
      const r = await fetch(`${API_BASE}/review/sessions?page=${page}&pageSize=20`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message ?? 'Lỗi tải lịch sử');
      return json.data;
    },
    enabled: !!token,
    staleTime: 60 * 1000,
  });
}

export function useReviewSessionDetail(token: string, sessionId: number | null) {
  return useQuery<ReviewSessionDetail>({
    queryKey: ['review', 'session', sessionId],
    queryFn: async ({ signal }) => {
      const r = await fetch(`${API_BASE}/review/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const json = await r.json();
      if (!json.success) throw new Error(json.message ?? 'Lỗi tải chi tiết');
      return json.data as ReviewSessionDetail;
    },
    enabled: !!token && sessionId !== null,
    staleTime: 5 * 60 * 1000,
  });
}

export async function submitBulk(
  token: string,
  results: { userWordId: number; correct: boolean }[],
  durationSeconds?: number
) {
  const r = await fetch(`${API_BASE}/review/submit-bulk`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ results, durationSeconds }),
  });
  const json = await r.json();
  if (!json.success) throw new Error(json.message ?? 'Lỗi gửi kết quả');
  return json.data as {
    sessionId?: number;
    total: number;
    correct: number;
    incorrect: number;
    scorePercent: number;
  };
}
