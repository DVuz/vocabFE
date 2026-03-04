import { createFileRoute } from '@tanstack/react-router';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { CEFR_CLASS, POS_CLASS } from '../components/vocabulary/constants';
import { useReviewSessionDetail, useReviewSessions } from '../hooks/useReviewQueue';

export const Route = createFileRoute('/review-history')({
  component: ReviewHistory,
});

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return '—';
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}p ${s}s` : `${m} phút`;
}

function ScoreBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const cls =
    pct >= 80
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : pct >= 50
        ? 'bg-amber-100 text-amber-700 border-amber-200'
        : 'bg-red-100 text-red-600 border-red-200';
  return <span className={`text-xs font-bold px-2 py-0.5 rounded border ${cls}`}>{pct}%</span>;
}

function SessionDetail({ sessionId, token }: { sessionId: number; token: string }) {
  const { data, isLoading, isError } = useReviewSessionDetail(token, sessionId);

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={20} className="animate-spin text-emerald-500" />
      </div>
    );

  if (isError || !data)
    return <p className="text-red-400 text-sm py-4 text-center">Không tải được chi tiết.</p>;

  const correct = data.items.filter(i => i.isCorrect).length;
  const wrong = data.items.filter(i => !i.isCorrect).length;

  return (
    <div className="mt-3 border-t border-zinc-100 pt-3">
      <div className="flex gap-4 text-xs text-zinc-500 mb-3">
        <span className="flex items-center gap-1">
          <CheckCircle2 size={13} className="text-emerald-500" />
          Đúng: <strong className="text-emerald-700 ml-0.5">{correct}</strong>
        </span>
        <span className="flex items-center gap-1">
          <XCircle size={13} className="text-red-400" />
          Sai: <strong className="text-red-600 ml-0.5">{wrong}</strong>
        </span>
      </div>

      <div className="space-y-2">
        {data.items.map(item => (
          <div
            key={item.id}
            className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${
              item.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.isCorrect ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <span className="font-bold text-sm text-zinc-900">{item.word}</span>
                {item.cefrLevel && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0 rounded border ${CEFR_CLASS[item.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
                  >
                    {item.cefrLevel}
                  </span>
                )}
                {item.partOfSpeech && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0 rounded ${POS_CLASS[item.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}
                  >
                    {item.partOfSpeech}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 leading-snug line-clamp-2">{item.definition}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[10px] text-zinc-400">
                streak {item.streakBefore ?? 0} → {item.streakAfter ?? 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SessionCard({ session, token }: { session: any; token: string }) {
  const [expanded, setExpanded] = useState(false);
  const pct = session.scorePercent;
  const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      <button
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-zinc-800">
              {formatDate(session.startedAt)}
            </span>
            <ScoreBadge pct={pct} />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
            <span>
              <strong className="text-zinc-700">{session.totalQuestions ?? 0}</strong> câu hỏi
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-500" />
              {session.correctAnswers ?? 0} đúng
            </span>
            <span className="flex items-center gap-1">
              <XCircle size={11} className="text-red-400" />
              {session.incorrectAnswers ?? 0} sai
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-zinc-400" />
              {formatDuration(session.durationSeconds)}
            </span>
          </div>
          {pct !== null && (
            <div className="mt-2 h-1.5 bg-zinc-100 rounded-full overflow-hidden max-w-xs">
              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
        <div className="shrink-0 text-zinc-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4">
          <SessionDetail sessionId={session.id} token={token} />
        </div>
      )}
    </div>
  );
}

function ReviewHistory() {
  const token = localStorage.getItem('access_token') ?? '';
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useReviewSessions(token, page);

  if (!token)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <ClipboardList size={40} className="text-zinc-300" />
        <p className="text-zinc-500 font-medium">Vui lòng đăng nhập để xem lịch sử ôn tập.</p>
      </div>
    );

  const sessions = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <div className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-5">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <ClipboardList size={20} className="text-emerald-600" />
            Lịch sử kiểm tra
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Xem lại kết quả từng buổi kiểm tra — đúng sai từng từ
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
          </div>
        )}

        {isError && (
          <p className="text-red-500 text-center py-10">Lỗi tải dữ liệu. Vui lòng thử lại sau.</p>
        )}

        {!isLoading && !isError && sessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <ClipboardList size={28} className="text-zinc-400" />
            </div>
            <p className="text-zinc-500 font-medium">Chưa có buổi kiểm tra nào.</p>
            <p className="text-zinc-400 text-sm">Làm bài kiểm tra để xem lịch sử tại đây.</p>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((s: any) => (
              <SessionCard key={s.id} session={s} token={token} />
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Trước
            </button>
            <span className="text-sm text-zinc-500">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <button
              disabled={!pagination.hasNext}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
