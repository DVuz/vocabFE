import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, BookOpen, BookPlus, Grid2x2, Layers, LayoutList, RotateCcw, Search, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { AddToListPopover } from '../components/vocabulary/AddToListPopover';
import { AudioButton } from '../components/vocabulary/AudioButton';
import {
  CEFR_CLASS,
  POS_CLASS,
  STATUS_CLASS,
  STATUS_LABEL,
} from '../components/vocabulary/constants';
import { MeaningDialog } from '../components/vocabulary/MeaningDialog';
import { PaginationBar } from '../components/vocabulary/PaginationBar';
import type { UserWordRow, VocabSearch } from '../components/vocabulary/types';
import { WordCard } from '../components/vocabulary/WordCard';
import { useVocabularyWords } from '../hooks/useVocabularyWords';

export const Route = createFileRoute('/vocabulary')({
  validateSearch: (s: Record<string, unknown>): VocabSearch => ({
    page: s.page ? Number(s.page) : 1,
    pageSize: s.pageSize ? Number(s.pageSize) : 20,
    status: typeof s.status === 'string' ? s.status : undefined,
    tab: s.tab === 'due' ? 'due' : 'all',
    q: typeof s.q === 'string' ? s.q : undefined,
  }),
  component: Vocabulary,
});

// ── Main Component ────────────────────────────────────────────────────────
function Vocabulary() {
  const navigate = useNavigate({ from: '/vocabulary' });
  const { page = 1, pageSize = 20, status, tab = 'all', q } = Route.useSearch();
  const token = localStorage.getItem('access_token') ?? '';

  const [selected, setSelected] = useState<UserWordRow | null>(null);
  const [searchInput, setSearchInput] = useState(q ?? '');
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'flashcard'>('table');

  const { data, isFetching, isError, error } = useVocabularyWords({
    page,
    pageSize,
    status,
    tab,
    q,
    token,
  });

  const rows = data?.data ?? [];
  const pagination = data?.pagination ?? null;
  const total = pagination?.total ?? 0;
  const errorMsg = isError ? ((error as Error)?.message ?? 'Lỗi kết nối') : null;

  function goPage(p: number) {
    navigate({ search: prev => ({ ...prev, page: p }) });
  }
  function changePageSize(v: string) {
    navigate({ search: prev => ({ ...prev, pageSize: Number(v), page: 1 }) });
  }
  function changeStatus(v: string) {
    navigate({ search: prev => ({ ...prev, status: v === 'all' ? undefined : v, page: 1 }) });
  }
  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: prev => ({ ...prev, q: searchInput || undefined, page: 1 }) });
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-1">
          <BookPlus size={28} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-800">Đăng nhập để xem từ vựng</h2>
        <p className="text-sm text-zinc-400">Bạn cần đăng nhập để truy cập danh sách từ đã lưu.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      {/* ── Hero header ── */}
      <div className="bg-linear-to-br from-slate-100 to-blue-50 border-b border-slate-200">
        <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-10 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-200">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Vocabulary</h1>
              <p className="text-sm text-slate-500">Manage and review your vocabulary list</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${viewMode === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutList size={14} />
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Grid2x2 size={14} />
              Grid
            </button>
            <button
              onClick={() => setViewMode('flashcard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                ${viewMode === 'flashcard' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Layers size={14} />
              Flashcard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-440 mx-auto px-4 sm:px-6 lg:px-10 py-6">
        {/* ── Tabs ── */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => navigate({ search: prev => ({ ...prev, tab: 'all', page: 1 }) })}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all
              ${tab !== 'due' ? 'bg-white border-slate-300 text-slate-800 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            All Words
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${tab !== 'due' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
            >
              {isFetching ? '…' : total}
            </span>
          </button>
          <button
            onClick={() => navigate({ search: prev => ({ ...prev, tab: 'due', page: 1 }) })}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all
              ${tab === 'due' ? 'bg-white border-slate-300 text-slate-800 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Due Today
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${tab === 'due' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}
            >
              —
            </span>
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm mb-4 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
            <form onSubmit={submitSearch} className="relative flex-1 min-w-40">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search words..."
                className="w-full pl-8 pr-3 h-9 text-sm border border-zinc-200 rounded-lg bg-zinc-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </form>

            <Select value={status ?? 'all'} onValueChange={changeStatus}>
              <SelectTrigger className="w-48 text-sm h-9 bg-white gap-1.5">
                <Search size={13} className="text-zinc-400 shrink-0" />
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses ({total})</SelectItem>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto flex items-center gap-2">
              <Select value={String(pageSize)} onValueChange={changePageSize}>
                <SelectTrigger className="w-28 text-sm h-9 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50].map(n => (
                    <SelectItem key={n} value={String(n)}>
                      {n} / trang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-zinc-500 whitespace-nowrap hidden sm:block">
                Total: <span className="font-bold text-blue-600">{isFetching ? '…' : total}</span>{' '}
                words
              </span>
            </div>
          </div>
        </div>

        {/* ── FLASHCARD VIEW (all screens) ── */}
        {viewMode === 'flashcard' && (
          <VocabFlashcardView rows={rows} isFetching={isFetching} />
        )}

        {/* ── MOBILE: card list ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {isFetching &&
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-zinc-200 rounded-2xl p-4 animate-pulse space-y-2.5"
              >
                <div className="h-5 bg-zinc-100 rounded-lg w-1/3" />
                <div className="h-3 bg-zinc-100 rounded w-1/2" />
                <div className="h-3 bg-zinc-100 rounded w-2/3" />
              </div>
            ))}
          {!isFetching && errorMsg && (
            <div className="text-center py-16 text-zinc-400 bg-white rounded-2xl border border-zinc-200">
              {errorMsg}
            </div>
          )}
          {!isFetching && !errorMsg && rows.length === 0 && (
            <div className="text-center py-16 text-zinc-400 bg-white rounded-2xl border border-zinc-200">
              Chưa có từ nào được lưu.
            </div>
          )}
          {!isFetching &&
            !errorMsg &&
            rows.map(row => (
              <WordCard
                key={row.userWordId}
                row={row}
                token={token}
                onOpen={() => setSelected(row)}
              />
            ))}
        </div>

        {/* ── DESKTOP: grid or table ── */}
        {viewMode === 'flashcard' ? null : viewMode === 'grid' ? (
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {isFetching &&
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-zinc-200 rounded-xl p-4 animate-pulse space-y-2"
                >
                  <div className="h-5 bg-zinc-100 rounded w-2/3" />
                  <div className="h-3 bg-zinc-100 rounded w-full" />
                  <div className="h-3 bg-zinc-100 rounded w-3/4" />
                </div>
              ))}
            {!isFetching &&
              !errorMsg &&
              rows.map(row => (
                <div
                  key={row.userWordId}
                  className="bg-white border border-zinc-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelected(row)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg font-bold text-zinc-900">{row.word}</span>
                    {row.cefrLevel && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${CEFR_CLASS[row.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
                      >
                        {row.cefrLevel}
                      </span>
                    )}
                  </div>
                  {row.partOfSpeech && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded inline-block mb-2 ${POS_CLASS[row.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}
                    >
                      {row.partOfSpeech}
                    </span>
                  )}
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {row.definition}
                  </p>
                  {row.ipa.uk && (
                    <p className="text-[11px] font-mono text-blue-600 mt-1.5">/{row.ipa.uk}/</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CLASS[row.status ?? 'new'] ?? STATUS_CLASS.new}`}
                    >
                      {STATUS_LABEL[row.status ?? 'new'] ?? row.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="hidden md:block rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 hover:bg-zinc-50 border-b border-zinc-200">
                  <TableHead className="w-36 font-semibold text-zinc-400 text-[11px] uppercase tracking-widest py-3 pl-5">
                    Word
                  </TableHead>
                  <TableHead className="w-28 font-semibold text-zinc-400 text-[11px] uppercase tracking-widest py-3">
                    Type
                  </TableHead>
                  <TableHead className="w-60 font-semibold text-zinc-400 text-[11px] uppercase tracking-widest py-3">
                    Pronunciation
                  </TableHead>
                  <TableHead className="max-w-60 w-60 font-semibold text-zinc-400 text-[11px] uppercase tracking-widest py-3 truncate">
                    Meaning
                  </TableHead>
                  <TableHead className="w-52 font-semibold text-zinc-400 text-[11px] uppercase tracking-widest py-3">
                    Example
                  </TableHead>
                  <TableHead className="w-10 py-3" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse border-zinc-100">
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j} className="py-4">
                          <div className="h-4 bg-zinc-100 rounded-lg w-3/4" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}

                {!isFetching && errorMsg && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-24 text-zinc-400">
                      {errorMsg}
                    </TableCell>
                  </TableRow>
                )}
                {!isFetching && !errorMsg && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-24 text-zinc-400">
                      Chưa có từ nào được lưu.
                    </TableCell>
                  </TableRow>
                )}

                {!isFetching &&
                  !errorMsg &&
                  rows.map(row => (
                    <TableRow
                      key={row.userWordId}
                      className="hover:bg-blue-50/40 border-zinc-100 group cursor-pointer"
                      onClick={() => setSelected(row)}
                    >
                      <TableCell className="py-4 pl-5">
                        <span className="font-bold text-zinc-900 text-[15px]">{row.word}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        {row.partOfSpeech ? (
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${POS_CLASS[row.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}
                          >
                            {row.partOfSpeech}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-0.5">
                          {row.ipa.uk && (
                            <span className="flex items-center gap-1.5 text-[12px] font-mono text-blue-700">
                              /{row.ipa.uk}/
                              {row.audio.uk && <AudioButton url={row.audio.uk} label="UK" />}
                            </span>
                          )}
                          {row.ipa.us && (
                            <span className="flex items-center gap-1.5 text-[12px] font-mono text-amber-700">
                              /{row.ipa.us}/
                              {row.audio.us && <AudioButton url={row.audio.us} label="US" />}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-start gap-2">
                          <div className="group">
                            <AddToListPopover meaningId={row.meaningId} token={token} />
                          </div>
                          {row.cefrLevel && (
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${CEFR_CLASS[row.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
                            >
                              {row.cefrLevel}
                            </span>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm text-zinc-800 line-clamp-1 font-medium">
                              {row.definition}
                            </p>
                            {row.vnDefinition && (
                              <p className="text-xs text-zinc-400 italic line-clamp-1 mt-0.5">
                                {row.vnDefinition}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        {row.examples.length > 0 ? (
                          <p className="text-xs text-zinc-500 italic line-clamp-2 leading-relaxed">
                            "{row.examples[0]}"
                          </p>
                        ) : (
                          <span className="text-xs text-zinc-300">No examples</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {viewMode !== 'flashcard' && pagination && <PaginationBar pagination={pagination} onPage={goPage} />}

        {/* Paginator shown under flashcard view too */}
        {viewMode === 'flashcard' && pagination && <PaginationBar pagination={pagination} onPage={goPage} />}

        {/* Meaning dialog */}
        <MeaningDialog row={selected} open={!!selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}

// ── Vocab Flashcard View ───────────────────────────────────────────────────
function playAudio(url: string) {
  const a = new Audio(url);
  a.play().catch(() => {});
}

function VocabFlashcardView({ rows, isFetching }: { rows: UserWordRow[]; isFetching: boolean }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Reset when rows change (page change)
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [rows]);

  const card = rows[index];

  const goNext = useCallback(() => {
    if (index >= rows.length - 1) return;
    setFlipped(false);
    setTimeout(() => setIndex(i => i + 1), 150);
  }, [index, rows.length]);

  const goPrev = useCallback(() => {
    if (index <= 0) return;
    setFlipped(false);
    setTimeout(() => setIndex(i => i - 1), 150);
  }, [index]);

  const flip = useCallback(() => setFlipped(f => !f), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); flip(); }
      if (e.code === 'ArrowRight' || e.key === 'l' || e.key === 'L') { e.preventDefault(); goNext(); }
      if (e.code === 'ArrowLeft' || e.key === 'h' || e.key === 'H') { e.preventDefault(); goPrev(); }
      if ((e.key === 'u' || e.key === 'U') && card?.audio?.uk) playAudio(card.audio.uk);
      if ((e.key === 'a' || e.key === 'A') && card?.audio?.us) playAudio(card.audio.us);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flip, goNext, goPrev, card]);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <RotateCcw size={28} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-400">Không có từ nào để hiển thị.</div>
    );
  }

  const progress = ((index + 1) / rows.length) * 100;

  return (
    <div className="flex flex-col items-center gap-6 pb-4">
      {/* progress */}
      <div className="w-full flex items-center gap-3">
        <span className="text-xs text-zinc-400 shrink-0">{index + 1} / {rows.length}</span>
        <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* card */}
      {card && (
        <div
          className="w-full max-w-2xl cursor-pointer select-none"
          style={{ perspective: '1200px' }}
          onClick={flip}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '380px',
            }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 rounded-3xl bg-white border border-zinc-200 shadow-xl flex flex-col items-center justify-center gap-4 px-8 py-10"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                {card.cefrLevel && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${CEFR_CLASS[card.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                    {card.cefrLevel}
                  </span>
                )}
                {card.partOfSpeech && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${POS_CLASS[card.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}>
                    {card.partOfSpeech}
                  </span>
                )}
                {card.status && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CLASS[card.status] ?? STATUS_CLASS.new}`}>
                    {STATUS_LABEL[card.status] ?? card.status}
                  </span>
                )}
              </div>
              <h2 className="text-5xl font-black text-zinc-900 tracking-tight text-center">{card.word}</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {card.ipa?.uk && (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5">
                    <span className="text-[11px] font-bold text-blue-400 uppercase">UK</span>
                    <span className="font-mono text-sm text-blue-700">/{card.ipa.uk}/</span>
                    {card.audio?.uk && (
                      <button onClick={e => { e.stopPropagation(); playAudio(card.audio.uk!); }} className="text-blue-500 hover:text-blue-700">
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                )}
                {card.ipa?.us && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
                    <span className="text-[11px] font-bold text-amber-400 uppercase">US</span>
                    <span className="font-mono text-sm text-amber-700">/{card.ipa.us}/</span>
                    {card.audio?.us && (
                      <button onClick={e => { e.stopPropagation(); playAudio(card.audio.us!); }} className="text-amber-500 hover:text-amber-700">
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-zinc-400 mt-1">Nhấn Space hoặc click để xem nghĩa</p>
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 rounded-3xl bg-white border border-emerald-200 shadow-xl flex flex-col justify-center gap-4 px-8 py-10 overflow-y-auto"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {card.cefrLevel && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${CEFR_CLASS[card.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                    {card.cefrLevel}
                  </span>
                )}
                {card.partOfSpeech && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${POS_CLASS[card.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}>
                    {card.partOfSpeech}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 text-center">{card.word}</h3>
              <div className="border-t border-zinc-100 pt-4 space-y-2">
                <p className="text-base font-semibold text-zinc-800 text-center leading-relaxed">{card.definition}</p>
                {card.vnDefinition && (
                  <p className="text-sm text-zinc-500 italic text-center">{card.vnDefinition}</p>
                )}
              </div>
              {card.examples.length > 0 && (
                <ul className="space-y-1.5 border-t border-zinc-100 pt-3">
                  {card.examples.slice(0, 2).map((ex, i) => (
                    <li key={i} className="text-xs text-zinc-500 italic pl-3 border-l-2 border-emerald-200">"{ex}"</li>
                  ))}
                </ul>
              )}
              <p className="text-sm text-zinc-400 text-center mt-1">→ / L để đến từ tiếp theo</p>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-medium hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ArrowLeft size={16} />Trước
        </button>
        <button
          onClick={flip}
          className="px-6 py-2.5 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition-all shadow-sm"
        >
          Lật thẻ
        </button>
        <button
          onClick={goNext}
          disabled={index >= rows.length - 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-medium hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          Tiếp theo<ArrowRight size={16} />
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
        {[['Space', 'Lật thẻ'], ['←/H', 'Quay lại'], ['→/L', 'Tiếp theo'], ['U', 'Nghe UK'], ['A', 'Nghe US']].map(([k, l]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs text-zinc-500">
            <kbd className="inline-flex items-center justify-center min-w-7 h-6 px-1.5 rounded bg-white border border-zinc-300 shadow-sm font-mono text-[11px] text-zinc-700">{k}</kbd>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
