import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Layers,
  Loader2,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  CEFR_CLASS,
  POS_CLASS,
  STATUS_CLASS,
  STATUS_LABEL,
} from '../components/vocabulary/constants';
import type { UserWordRow } from '../components/vocabulary/types';
import { PaginationBar } from '../components/vocabulary/PaginationBar';
import type { ReviewCard } from '../hooks/useReviewQueue';
import { useReviewQueue } from '../hooks/useReviewQueue';
import { useVocabularyWords } from '../hooks/useVocabularyWords';

export const Route = createFileRoute('/review')({
  component: Review,
});

// ── Audio helper ───────────────────────────────────────────────────────────
function playAudio(url: string) {
  const a = new Audio(url);
  a.play().catch(() => {});
}

// ── Flashcard ──────────────────────────────────────────────────────────────
function Flashcard({
  card,
  flipped,
  onFlip,
}: {
  card: ReviewCard;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '420px',
        }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 rounded-3xl bg-white border border-zinc-200 shadow-xl flex flex-col items-center justify-center gap-5 px-8 py-10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {card.cefrLevel && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${CEFR_CLASS[card.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
              >
                {card.cefrLevel}
              </span>
            )}
            {card.partOfSpeech && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${POS_CLASS[card.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}
              >
                {card.partOfSpeech}
              </span>
            )}
            {card.status && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${STATUS_CLASS[card.status] ?? STATUS_CLASS.new}`}
              >
                {STATUS_LABEL[card.status] ?? card.status}
              </span>
            )}
          </div>

          <h2 className="text-5xl font-black text-zinc-900 tracking-tight text-center leading-tight">
            {card.word}
          </h2>

          <div className="flex flex-wrap gap-3 justify-center">
            {card.ipa.uk && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5">
                <span className="text-[11px] font-bold text-blue-400 uppercase">UK</span>
                <span className="font-mono text-sm text-blue-700">/{card.ipa.uk}/</span>
                {card.audio.uk && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      playAudio(card.audio.uk!);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            )}
            {card.ipa.us && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase">US</span>
                <span className="font-mono text-sm text-amber-700">/{card.ipa.us}/</span>
                {card.audio.us && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      playAudio(card.audio.us!);
                    }}
                    className="text-amber-500 hover:text-amber-700 transition-colors"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-zinc-400 mt-2">Nhấn Space hoặc click để xem nghĩa</p>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 rounded-3xl bg-white border border-emerald-200 shadow-xl flex flex-col justify-center gap-4 px-8 py-10 overflow-y-auto"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {card.cefrLevel && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${CEFR_CLASS[card.cefrLevel] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}
              >
                {card.cefrLevel}
              </span>
            )}
            {card.partOfSpeech && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${POS_CLASS[card.partOfSpeech.toLowerCase()] ?? 'bg-zinc-100 text-zinc-500'}`}
              >
                {card.partOfSpeech}
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-zinc-900 text-center">{card.word}</h3>

          <div className="border-t border-zinc-100 pt-4 space-y-2">
            <p className="text-base font-semibold text-zinc-800 text-center leading-relaxed">
              {card.definition}
            </p>
            {card.vnDefinition && (
              <p className="text-sm text-zinc-500 italic text-center">{card.vnDefinition}</p>
            )}
          </div>

          {card.examples.length > 0 && (
            <ul className="space-y-1.5 border-t border-zinc-100 pt-3">
              {card.examples.slice(0, 2).map((ex, i) => (
                <li
                  key={i}
                  className="text-xs text-zinc-500 italic pl-3 border-l-2 border-emerald-200"
                >
                  "{ex}"
                </li>
              ))}
            </ul>
          )}

          <p className="text-sm text-zinc-400 text-center mt-2">→ / L để đến từ tiếp theo</p>
        </div>
      </div>
    </div>
  );
}

// ── Keyboard hint pill ─────────────────────────────────────────────────────
function KbdHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
      {keys.map(k => (
        <kbd
          key={k}
          className="inline-flex items-center justify-center min-w-7 h-7 px-1.5 rounded-md bg-white border border-zinc-300 shadow-sm font-mono text-[11px] text-zinc-700"
        >
          {k}
        </kbd>
      ))}
      <span>{label}</span>
    </div>
  );
}

// ── Vocab-page flashcard runner ────────────────────────────────────────────
function VocabPageFlashcard({ token, onSwitchToDue }: { token: string; onSwitchToDue: () => void }) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { data, isFetching } = useVocabularyWords({ page, pageSize, token });
  const rows: UserWordRow[] = data?.data ?? [];
  const pagination = data?.pagination ?? null;

  useEffect(() => { setIndex(0); setFlipped(false); }, [page, rows]);

  const card = rows[index];
  const goNext = useCallback(() => {
    if (index >= rows.length - 1) return;
    setFlipped(false); setTimeout(() => setIndex(i => i + 1), 150);
  }, [index, rows.length]);
  const goPrev = useCallback(() => {
    if (index <= 0) return;
    setFlipped(false); setTimeout(() => setIndex(i => i - 1), 150);
  }, [index]);
  const flip = useCallback(() => setFlipped(f => !f), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); flip(); }
      if (e.code === 'ArrowRight' || e.key === 'l' || e.key === 'L') { e.preventDefault(); goNext(); }
      if (e.code === 'ArrowLeft' || e.key === 'h' || e.key === 'H') { e.preventDefault(); goPrev(); }
      if ((e.key === 'u' || e.key === 'U') && card?.audio?.uk) playAudio(card.audio.uk!);
      if ((e.key === 'a' || e.key === 'A') && card?.audio?.us) playAudio(card.audio.us!);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flip, goNext, goPrev, card]);

  // Build a ReviewCard-compatible shape from UserWordRow for the existing Flashcard component
  const reviewCard: ReviewCard | undefined = card
    ? {
        userWordId: card.userWordId,
        wordId: card.wordId,
        word: card.word,
        meaningId: card.meaningId,
        partOfSpeech: card.partOfSpeech,
        cefrLevel: card.cefrLevel,
        definition: card.definition,
        vnDefinition: card.vnDefinition,
        examples: card.examples,
        ipa: card.ipa,
        audio: card.audio,
        status: card.status,
      }
    : undefined;

  const progress = rows.length > 0 ? ((index + 1) / rows.length) * 100 : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">Flashcard — Từ vựng của tôi</h1>
            <p className="text-xs text-zinc-400">
              {isFetching ? 'Đang tải...' : `Thẻ ${index + 1} / ${rows.length} (trang ${page})`}
            </p>
          </div>
          <Link to="/review" onClick={onSwitchToDue} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors">
            <RotateCcw size={14} />Ôn theo lịch
          </Link>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-zinc-100">
        <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6">
        {isFetching ? (
          <Loader2 size={32} className="animate-spin text-emerald-500" />
        ) : rows.length === 0 ? (
          <p className="text-zinc-400">Không có từ vựng nào.</p>
        ) : (
          <div className="w-full max-w-2xl">
            {reviewCard && <Flashcard card={reviewCard} flipped={flipped} onFlip={flip} />}
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center gap-3">
          <button onClick={goPrev} disabled={index === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-medium hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
            <ArrowLeft size={16} />Trước
          </button>
          <button onClick={flip}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition-all shadow-sm">
            Lật thẻ
          </button>
          <button onClick={goNext} disabled={index >= rows.length - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-medium hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
            Tiếp theo<ArrowRight size={16} />
          </button>
        </div>

        {/* Keyboard hints */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
          {[['Space', 'Lật thẻ'], ['←/H', 'Quay lại'], ['→/L', 'Tiếp theo'], ['U', 'Nghe UK'], ['A', 'Nghe US']].map(([k, l]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-zinc-500">
              <kbd className="inline-flex items-center justify-center min-w-7 h-7 px-1.5 rounded-md bg-white border border-zinc-300 shadow-sm font-mono text-[11px] text-zinc-700">{k}</kbd>
              <span>{l}</span>
            </div>
          ))}
        </div>

        {/* Pagination to switch pages */}
        {pagination && (
          <div className="mt-4">
            <PaginationBar pagination={pagination} onPage={p => setPage(p)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Due-today review (extracted so hooks are never called conditionally) ──
function DueReview({ token, onSwitchMode }: { token: string; onSwitchMode: () => void }) {
  const { data: cards = [], isLoading, isError, refetch } = useReviewQueue(token);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  const card = cards[index];

  const goNext = useCallback(() => {
    if (index >= cards.length - 1) {
      setDone(true);
      return;
    }
    setFlipped(false);
    setTimeout(() => setIndex(i => i + 1), 150);
  }, [index, cards.length]);

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
      if ((e.key === 'u' || e.key === 'U') && card?.audio.uk) playAudio(card.audio.uk);
      if ((e.key === 'a' || e.key === 'A') && card?.audio.us) playAudio(card.audio.us);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flip, goNext, goPrev, card]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <RotateCcw size={40} className="text-zinc-300" />
        <p className="text-zinc-500 font-medium">Vui lòng đăng nhập để ôn tập.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <p className="text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <BookOpen size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-800">
          Tuyệt vời! Không còn từ nào cần ôn hôm nay.
        </h2>
        <p className="text-zinc-400 text-sm">Quay lại sau để tiếp tục ôn tập.</p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/vocabulary"
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            Xem từ vựng của tôi
          </Link>
          <button
            onClick={onSwitchMode}
            className="flex items-center gap-2 px-5 py-2.5 border border-zinc-300 text-zinc-700 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors"
          >
            <Layers size={15} />
            Ôn theo danh sách
          </button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 flex items-center justify-center shadow-sm">
          <BookOpen size={40} className="text-emerald-500" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900 mb-1">
            Đã ôn hết {cards.length} từ 🎉
          </h2>
          <p className="text-zinc-400 text-sm">
            Bạn vừa ôn xong tất cả flashcard hôm nay. Hãy kiểm tra để đánh giá mức độ nhớ!
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => { setIndex(0); setFlipped(false); setDone(false); }}
            className="flex items-center gap-2 px-5 py-2.5 border border-zinc-300 text-zinc-700 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors"
          >
            <RotateCcw size={15} />
            Ôn lại từ đầu
          </button>
          <Link
            to="/quiz"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            <ClipboardList size={15} />
            Kiểm tra ngay
          </Link>
        </div>
      </div>
    );
  }

  const progress = ((index + 1) / cards.length) * 100;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 flex flex-col">
      {/* Header bar */}
      <div className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-zinc-900">Ôn tập Flashcard</h1>
            <p className="text-xs text-zinc-400">
              {index + 1} / {cards.length} từ hôm nay
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Layers size={14} />
              Ôn theo danh sách
            </button>
            <Link
              to="/quiz"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <ClipboardList size={14} />
              Chuyển sang kiểm tra
            </Link>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-zinc-100">
        <div
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {card && <Flashcard card={card} flipped={flipped} onFlip={flip} />}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-medium hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            Trước
          </button>
          <button
            onClick={flip}
            className="px-6 py-2.5 rounded-xl bg-zinc-800 text-white text-sm font-semibold hover:bg-zinc-700 transition-all shadow-sm"
          >
            Lật thẻ
          </button>
          <button
            onClick={goNext}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-600 text-sm font-medium hover:bg-zinc-50 transition-all shadow-sm"
          >
            Tiếp theo
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Keyboard hints */}
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 justify-center">
          <KbdHint keys={['Space']} label="Lật thẻ" />
          <KbdHint keys={['←', 'H']} label="Quay lại" />
          <KbdHint keys={['→', 'L']} label="Tiếp theo" />
          <KbdHint keys={['U']} label="Nghe UK" />
          <KbdHint keys={['A']} label="Nghe US" />
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
function Review() {
  const token = localStorage.getItem('access_token') ?? '';
  const [mode, setMode] = useState<'due' | 'vocab'>('due');

  if (mode === 'vocab') {
    return <VocabPageFlashcard token={token} onSwitchToDue={() => setMode('due')} />;
  }
  return <DueReview token={token} onSwitchMode={() => setMode('vocab')} />;
}
