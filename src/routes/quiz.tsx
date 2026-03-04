import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RotateCcw,
  Volume2,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CEFR_CLASS, POS_CLASS } from '../components/vocabulary/constants';
import { DISTRACTOR_POOL } from '../components/vocabulary/distractor-pool';
import type { ReviewCard } from '../hooks/useReviewQueue';
import { submitBulk, useReviewQueue } from '../hooks/useReviewQueue';

export const Route = createFileRoute('/quiz')({
  component: Quiz,
});

interface Question {
  card: ReviewCard;
  choices: string[];
  correctIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(cards: ReviewCard[]): Question[] {
  // Pool of fallback distractors: shuffle once per quiz session so different
  // questions in the same session don't always see the same fakes.
  const usedDefs = new Set(cards.map(c => c.definition));
  const poolFiltered: string[] = DISTRACTOR_POOL.filter(d => !usedDefs.has(d));
  const shuffledPool: string[] = shuffle(poolFiltered);

  return cards.map((card, cardIdx) => {
    // Real distractors: other cards' definitions (exclude self)
    const realOthers: string[] = shuffle(
      cards.filter(c => c.userWordId !== card.userWordId).map(c => c.definition)
    ).slice(0, 3);

    // Fill remaining slots with pool entries, giving each card a different
    // starting offset so consecutive questions don't show identical fakes.
    const needed = 3 - realOthers.length;
    const realOthersSet = new Set(realOthers);
    const poolFallback: string[] = [];
    if (needed > 0) {
      const offset = (cardIdx * 3) % Math.max(shuffledPool.length, 1);
      const wrapped: string[] = [...shuffledPool.slice(offset), ...shuffledPool.slice(0, offset)];
      for (const d of wrapped) {
        if (!realOthersSet.has(d) && poolFallback.length < needed) poolFallback.push(d);
      }
    }

    const allChoices: string[] = shuffle([card.definition, ...realOthers, ...poolFallback]);
    const correctIndex = allChoices.indexOf(card.definition);
    return { card, choices: allChoices, correctIndex };
  });
}

function playAudio(url: string) {
  const a = new Audio(url);
  a.play().catch(() => {});
}

function ScoreScreen({
  total,
  correct,
  onRetry,
}: {
  total: number;
  correct: number;
  onRetry: () => void;
}) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚';
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
      <div className="w-24 h-24 rounded-3xl bg-emerald-50 shadow-sm flex items-center justify-center text-5xl">
        {emoji}
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-zinc-900 mb-1">
          {correct} / {total} đúng
        </h2>
        <p className="text-zinc-400 text-sm">Tỷ lệ chính xác: {pct}%</p>
      </div>
      <div className="w-full max-w-xs">
        <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 border border-zinc-300 text-zinc-700 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors"
        >
          <RotateCcw size={15} />
          Làm lại
        </button>
        <Link
          to="/review"
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          Ôn tập lại
        </Link>
      </div>
    </div>
  );
}

function QuestionCard({
  q,
  index,
  total,
  answered,
  onAnswer,
  onNext,
}: {
  q: Question;
  index: number;
  total: number;
  answered: number | null;
  onAnswer: (idx: number) => void;
  onNext: () => void;
}) {
  const { card, choices, correctIndex } = q;
  const isAnswered = answered !== null;

  function choiceClass(i: number) {
    if (!isAnswered)
      return 'border-zinc-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer';
    if (i === correctIndex) return 'border-emerald-500 bg-emerald-50 cursor-default';
    if (i === answered && i !== correctIndex) return 'border-red-400 bg-red-50 cursor-default';
    return 'border-zinc-100 bg-zinc-50 opacity-50 cursor-default';
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between text-sm text-zinc-400 mb-4">
        <span>
          Câu {index + 1} / {total}
        </span>
        <div className="flex-1 mx-4 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        {isAnswered ? (
          answered === correctIndex ? (
            <CheckCircle2 size={18} className="text-emerald-500" />
          ) : (
            <XCircle size={18} className="text-red-500" />
          )
        ) : null}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-1.5">
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
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight">{card.word}</h2>
          <div className="flex flex-col gap-1.5 w-full">
            {card.ipa.uk && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-blue-400">UK</span>
                <span className="font-mono text-sm text-blue-700">/{card.ipa.uk}/</span>
                {card.audio.uk && (
                  <button
                    onClick={() => playAudio(card.audio.uk!)}
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                    title="[U] Nghe UK"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            )}
            {card.ipa.us && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400">US</span>
                <span className="font-mono text-sm text-amber-700">/{card.ipa.us}/</span>
                {card.audio.us && (
                  <button
                    onClick={() => playAudio(card.audio.us!)}
                    className="text-amber-400 hover:text-amber-600 transition-colors"
                    title="[A] Nghe US"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {choices.map((def, i) => (
            <button
              key={i}
              disabled={isAnswered}
              onClick={() => onAnswer(i)}
              className={`relative flex items-start gap-3 w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm leading-relaxed ${choiceClass(i)}`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-all ${!isAnswered ? 'bg-zinc-100 text-zinc-500' : i === correctIndex ? 'bg-emerald-500 text-white' : i === answered ? 'bg-red-400 text-white' : 'bg-zinc-100 text-zinc-300'}`}
              >
                {i + 1}
              </span>
              <span
                className={isAnswered && i === correctIndex ? 'text-emerald-800 font-medium' : ''}
              >
                {def}
              </span>
            </button>
          ))}
        </div>
      </div>
      {isAnswered && (
        <div className="flex justify-end mt-4">
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 text-white rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-all shadow-sm"
          >
            {index < total - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-5 justify-center">
        {!isAnswered && (
          <>
            {[1, 2, 3, 4].map(n => (
              <span key={n} className="flex items-center gap-1 text-xs text-zinc-400">
                <kbd className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white border border-zinc-300 shadow-sm font-mono text-[11px] text-zinc-600">
                  {n}
                </kbd>
                <span>Chọn {n}</span>
              </span>
            ))}
          </>
        )}
        {isAnswered && (
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <kbd className="inline-flex items-center justify-center px-2 h-6 rounded-md bg-white border border-zinc-300 shadow-sm font-mono text-[11px] text-zinc-600">
              Enter / →
            </kbd>
            <span>Câu tiếp theo</span>
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <kbd className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white border border-zinc-300 shadow-sm font-mono text-[11px] text-zinc-600">
            U
          </kbd>
          <span>Nghe UK</span>
        </span>
        <span className="flex items-center gap-1 text-xs text-zinc-400">
          <kbd className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white border border-zinc-300 shadow-sm font-mono text-[11px] text-zinc-600">
            A
          </kbd>
          <span>Nghe US</span>
        </span>
      </div>
    </div>
  );
}

function Quiz() {
  const token = localStorage.getItem('access_token') ?? '';
  const { data: cards = [], isLoading, isError, refetch } = useReviewQueue(token);
  const questions = useMemo(() => (cards.length ? buildQuestions(cards) : []), [cards]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<{ total: number; correct: number } | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (questions.length) {
      setAnswers(new Array(questions.length).fill(null));
      startTimeRef.current = Date.now();
    }
  }, [questions]);

  const handleAnswer = useCallback(
    (idx: number) => {
      setAnswers(prev => {
        if (prev[qIndex] !== null) return prev;
        const next = [...prev];
        next[qIndex] = idx;
        return next;
      });
    },
    [qIndex]
  );

  const handleNext = useCallback(async () => {
    if (qIndex < questions.length - 1) {
      setQIndex(q => q + 1);
      return;
    }
    setSubmitting(true);
    try {
      const results = questions.map((q, i) => ({
        userWordId: q.card.userWordId,
        correct: answers[i] === q.correctIndex,
      }));
      const durationSeconds = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : undefined;
      const res = await submitBulk(token, results, durationSeconds);
      setScore({ total: res.total, correct: res.correct });
      setSubmitted(true);
    } catch {
      const correctCount = questions.filter((q, i) => answers[i] === q.correctIndex).length;
      setScore({ total: questions.length, correct: correctCount });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [qIndex, questions, answers, token]);

  const handleRetry = useCallback(() => {
    setQIndex(0);
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(null);
  }, [questions.length]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const q = questions[qIndex];
      if (!q) return;
      const isAnswered = answers[qIndex] !== null;
      if (!isAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          if (idx < q.choices.length) handleAnswer(idx);
        }
        if ((e.key === 'u' || e.key === 'U') && q.card.audio.uk) playAudio(q.card.audio.uk);
        if ((e.key === 'a' || e.key === 'A') && q.card.audio.us) playAudio(q.card.audio.us);
      } else {
        if (e.code === 'Enter' || e.code === 'ArrowRight') {
          e.preventDefault();
          if (!submitting) handleNext();
        }
        if ((e.key === 'u' || e.key === 'U') && q.card.audio.uk) playAudio(q.card.audio.uk);
        if ((e.key === 'a' || e.key === 'A') && q.card.audio.us) playAudio(q.card.audio.us);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [qIndex, questions, answers, handleAnswer, handleNext, submitting]);

  if (!token)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <ClipboardList size={40} className="text-zinc-300" />
        <p className="text-zinc-500 font-medium">Vui lòng đăng nhập để làm bài kiểm tra.</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <p className="text-red-500">Lỗi tải dữ liệu. Vui lòng thử lại.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          Thử lại
        </button>
      </div>
    );

  if (cards.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <ClipboardList size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-800">Không có từ nào cần kiểm tra hôm nay.</h2>
        <p className="text-zinc-400 text-sm">Hãy thêm từ mới vào từ vựng của bạn.</p>
        <Link
          to="/vocabulary"
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700"
        >
          Xem từ vựng
        </Link>
      </div>
    );

  if (submitted && score)
    return <ScoreScreen total={score.total} correct={score.correct} onRetry={handleRetry} />;

  if (submitting)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
        <p className="text-sm text-zinc-400">Đang lưu kết quả...</p>
      </div>
    );

  const currentQ = questions[qIndex];
  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 flex flex-col">
      <div className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <ClipboardList size={18} className="text-emerald-600" />
              Kiểm tra
            </h1>
            <p className="text-xs text-zinc-400">
              Ghép từ với nghĩa đúng — {questions.length} câu hỏi
            </p>
          </div>
          <Link
            to="/review"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            <RotateCcw size={14} />
            Ôn flashcard
          </Link>
        </div>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        {currentQ && (
          <QuestionCard
            q={currentQ}
            index={qIndex}
            total={questions.length}
            answered={answers[qIndex] ?? null}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
}
