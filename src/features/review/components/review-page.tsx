import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Keyboard,
  Layers,
  Loader2,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROUTES } from '../../../shared/constants/routes'
import {
  CEFR_CLASS,
  POS_CLASS,
  STATUS_CLASS,
  STATUS_LABEL,
} from '../../vocab/components/constants'
import { useReviewFlashcards } from '../hooks/use-review-flashcards'
import type { ReviewCard, ReviewMode } from '../types/review.types'
import { TypingReviewCard } from './TypingReviewCard'

function playAudio(url: string) {
  const audio = new Audio(url)
  void audio.play()
}

function Flashcard({
  card,
  flipped,
  onFlip,
}: {
  card: ReviewCard
  flipped: boolean
  onFlip: () => void
}) {
  const ttsAudioUrl = card.audio.tts ?? null

  return (
    <div
      className="w-full cursor-pointer select-none"
      style={{ perspective: '1400px' }}
      onClick={onFlip}
    >
      <div
        className="relative grid w-full transition-transform duration-500 [grid-template-areas:'card']"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT FACE */}
        <div
          className="flex min-h-[320px] flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 shadow-md [grid-area:card] sm:min-h-[380px] sm:p-8"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {card.cefrLevel && (
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                    CEFR_CLASS[card.cefrLevel] ??
                    'border-slate-200 bg-slate-100 text-slate-500'
                  }`}
                >
                  {card.cefrLevel}
                </span>
              )}
              {card.partOfSpeech && (
                <span
                  className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                    POS_CLASS[card.partOfSpeech.toLowerCase()] ??
                    'bg-slate-100 text-slate-600'
                  }`}
                >
                  {card.partOfSpeech}
                </span>
              )}
              {card.status && (
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                    STATUS_CLASS[card.status] ?? STATUS_CLASS.new
                  }`}
                >
                  {STATUS_LABEL[card.status] ?? card.status}
                </span>
              )}
            </div>

            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
              Mặt trước
            </span>
          </div>

          {/* Center Word & Pronunciation */}
          <div className="my-6 flex flex-col items-center gap-5 text-center sm:my-8">
            <h2 className="max-w-full text-3xl font-black tracking-tight break-words text-slate-900 sm:text-4xl md:text-5xl">
              {card.word}
            </h2>

            {(card.ipa.uk || card.ipa.us) && (
              <div className="flex flex-wrap justify-center gap-2.5">
                {card.ipa.uk && (
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      if (card.audio.uk) playAudio(card.audio.uk)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 font-mono text-xs font-semibold text-blue-700 transition hover:bg-blue-100 sm:text-sm"
                  >
                    <span className="text-[10px] font-extrabold tracking-wider text-blue-500 uppercase">
                      UK
                    </span>
                    <span>/{card.ipa.uk}/</span>
                    {card.audio.uk && (
                      <Volume2 size={14} className="text-blue-500" />
                    )}
                  </button>
                )}
                {card.ipa.us && (
                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      if (card.audio.us) playAudio(card.audio.us)
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-1.5 font-mono text-xs font-semibold text-amber-700 transition hover:bg-amber-100 sm:text-sm"
                  >
                    <span className="text-[10px] font-extrabold tracking-wider text-amber-500 uppercase">
                      US
                    </span>
                    <span>/{card.ipa.us}/</span>
                    {card.audio.us && (
                      <Volume2 size={14} className="text-amber-500" />
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="text-center text-xs font-medium text-slate-400">
            Chạm vào thẻ hoặc nhấn <span className="font-semibold">Space</span> để xem nghĩa
          </p>
        </div>

        {/* BACK FACE */}
        <div
          className="flex min-h-[320px] flex-col justify-between rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50/30 p-5 shadow-md [grid-area:card] sm:min-h-[380px] sm:p-8"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Top Bar on Back */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 sm:text-xl">
                {card.word}
              </h3>
              {card.partOfSpeech && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {card.partOfSpeech}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {card.audio.uk && (
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation()
                    playAudio(card.audio.uk!)
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                >
                  <Volume2 size={12} /> UK
                </button>
              )}
              {card.audio.us && (
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation()
                    playAudio(card.audio.us!)
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-100"
                >
                  <Volume2 size={12} /> US
                </button>
              )}
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                Giải nghĩa
              </span>
            </div>
          </div>

          {/* Definition & Examples */}
          <div className="my-4 flex flex-col gap-3 sm:my-5">
            <div className="flex items-start gap-3">
              {ttsAudioUrl && (
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation()
                    playAudio(ttsAudioUrl)
                  }}
                  className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-2xs transition hover:bg-emerald-100"
                  aria-label="Nghe đọc nghĩa"
                  title="Nghe đọc nghĩa"
                >
                  <Volume2 size={16} />
                </button>
              )}
              <p className="min-w-0 flex-1 text-base font-bold leading-relaxed break-words text-slate-800 sm:text-lg">
                {card.definition}
              </p>
            </div>

            {card.vnDefinition && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2.5">
                <p className="text-sm font-medium leading-relaxed text-emerald-900">
                  <Sparkles
                    size={13}
                    className="mr-1.5 inline text-emerald-600"
                  />
                  {card.vnDefinition}
                </p>
              </div>
            )}

            {card.examples.length > 0 && (
              <div className="mt-1 space-y-1.5 border-t border-slate-100 pt-3">
                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Ví dụ ngữ cảnh
                </p>
                {card.examples.slice(0, 2).map((example, idx) => (
                  <p
                    key={idx}
                    className="border-l-2 border-emerald-300 pl-3 text-xs italic leading-relaxed text-slate-600 sm:text-sm"
                  >
                    "{example}"
                  </p>
                ))}
              </div>
            )}
          </div>

          <p className="text-center text-xs font-medium text-slate-400">
            Chạm vào thẻ để lật lại mặt trước
          </p>
        </div>
      </div>
    </div>
  )
}

function KbdHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      {keys.map(key => (
        <kbd
          key={key}
          className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-slate-200 bg-white px-1.5 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs"
        >
          {key}
        </kbd>
      ))}
      <span>{label}</span>
    </div>
  )
}

export function ReviewPage() {
  const [mode, setMode] = useState<ReviewMode>('today')
  const [status, setStatus] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [practiceMode, setPracticeMode] = useState<'flashcard' | 'typing'>(
    'flashcard',
  )

  const { isLoggedIn, rows, isFetching, isError, error, refetch } =
    useReviewFlashcards(mode, {
      page,
      pageSize,
      status: status === 'all' ? undefined : status,
    })

  const sessionKey = useMemo(
    () =>
      `${mode}-${page}-${pageSize}-${status}-${rows.map(r => r.userWordId).join(',')}`,
    [mode, page, pageSize, status, rows],
  )

  const modeTitle = useMemo(
    () =>
      mode === 'today'
        ? 'Các từ vựng đến hạn cần ôn tập hôm nay'
        : 'Các từ vựng ưu tiên theo mức độ ghi nhớ',
    [mode],
  )

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <RotateCcw size={28} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Đăng nhập để ôn tập</h2>
        <p className="text-sm text-slate-500">
          Bạn cần đăng nhập để truy cập chế độ ôn tập flashcard.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Đi tới đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/60 pb-10">
      {/* Header */}
      <div className="border-b border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-emerald-50/50">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs ring-1 ring-slate-200/80">
                <BookOpen size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="mb-0.5 text-[11px] font-bold tracking-[0.16em] text-emerald-600 uppercase">
                  Luyện tập từ vựng
                </p>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                  Ôn tập Flashcard
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm">{modeTitle}</p>
              </div>
            </div>

            {/* Practice Mode Switcher (Flashcard vs Typing) */}
            <div className="flex items-center gap-1 self-start rounded-2xl border border-slate-200 bg-white p-1 shadow-2xs sm:self-auto">
              <button
                type="button"
                onClick={() => setPracticeMode('flashcard')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition sm:text-sm ${
                  practiceMode === 'flashcard'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BookOpen size={15} />
                <span>Lật thẻ</span>
              </button>
              <button
                type="button"
                onClick={() => setPracticeMode('typing')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition sm:text-sm ${
                  practiceMode === 'typing'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Keyboard size={15} />
                <span>Gõ từ</span>
              </button>
            </div>
          </div>

          {/* Secondary Toolbar: Source Queue + Filters + Quiz Link */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-200/60 pt-3.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Queue Mode Tabs */}
              <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setMode('today')
                    setPage(1)
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    mode === 'today'
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <RotateCcw size={13} />
                  <span>Đến hạn hôm nay</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('priority')
                    setPage(1)
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                    mode === 'priority'
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Layers size={13} />
                  <span>Ưu tiên ôn tập</span>
                </button>
              </div>

              <Select
                value={status}
                onValueChange={value => {
                  if (!value) return
                  setStatus(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-36 rounded-xl bg-white text-xs sm:w-40">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {Object.entries(STATUS_LABEL).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(pageSize)}
                onValueChange={value => {
                  if (!value) return
                  setPageSize(Number(value))
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-24 rounded-xl bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50].map(value => (
                    <SelectItem key={value} value={String(value)}>
                      {value} / trang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Link
              to={ROUTES.QUIZ}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:text-emerald-700"
            >
              <ClipboardList size={14} className="text-emerald-600" />
              <span>Kiểm tra ngay</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-7">
        {isFetching && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200/80 bg-white py-24 text-sm text-slate-500 shadow-2xs">
            <Loader2 size={28} className="animate-spin text-emerald-500" />
            <span>Đang tải danh sách ôn tập...</span>
          </div>
        )}

        {!isFetching && isError && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-red-200 bg-white py-16 text-center">
            <p className="text-sm font-medium text-red-600">
              {(error as Error)?.message ?? 'Lỗi tải dữ liệu ôn tập'}
            </p>
            <Button onClick={() => void refetch()} variant="outline">
              Thử lại
            </Button>
          </div>
        )}

        {!isFetching && !isError && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <BookOpen size={28} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Không có từ cần ôn
            </h2>
            <p className="max-w-sm text-sm text-slate-400">
              Bạn đã hoàn thành các từ cần ôn trong mục này. Hãy đổi bộ lọc hoặc thêm từ mới vào kho từ vựng.
            </p>
            <Link
              to={ROUTES.VOCABULARY}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Mở danh sách từ vựng
            </Link>
          </div>
        )}

        {!isFetching && !isError && rows.length > 0 && (
          <ReviewSessionDeck
            key={sessionKey}
            rows={rows}
            practiceMode={practiceMode}
          />
        )}
      </div>
    </div>
  )
}

function ReviewSessionDeck({
  rows,
  practiceMode,
}: {
  rows: ReviewCard[]
  practiceMode: 'flashcard' | 'typing'
}) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [typingAnswers, setTypingAnswers] = useState<string[]>(() =>
    new Array(rows.length).fill(''),
  )
  const [typingChecked, setTypingChecked] = useState<boolean[]>(() =>
    new Array(rows.length).fill(false),
  )
  const [showVietnamese, setShowVietnamese] = useState(false)

  const card = rows[index]

  const goNext = useCallback(() => {
    if (index >= rows.length - 1) return
    setFlipped(false)
    setTimeout(() => setIndex(value => value + 1), 120)
  }, [index, rows.length])

  const goPrev = useCallback(() => {
    if (index <= 0) return
    setFlipped(false)
    setTimeout(() => setIndex(value => value - 1), 120)
  }, [index])

  const flip = useCallback(() => setFlipped(value => !value), [])

  const handleTypingAnswer = useCallback(
    (answer: string) => {
      setTypingAnswers(previous => {
        const next = [...previous]
        next[index] = answer
        return next
      })
    },
    [index],
  )

  const handleTypingCheck = useCallback(() => {
    if (!typingAnswers[index]?.trim()) return
    setTypingChecked(previous => {
      const next = [...previous]
      next[index] = true
      return next
    })
  }, [index, typingAnswers])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tts = card?.audio?.tts
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault()
        flip()
      }

      if (
        event.code === 'ArrowRight' ||
        event.key === 'l' ||
        event.key === 'L'
      ) {
        event.preventDefault()
        goNext()
      }

      if (
        event.code === 'ArrowLeft' ||
        event.key === 'h' ||
        event.key === 'H'
      ) {
        event.preventDefault()
        goPrev()
      }

      if ((event.key === 'u' || event.key === 'U') && card?.audio.uk) {
        playAudio(card.audio.uk)
      }

      if ((event.key === 'a' || event.key === 'A') && card?.audio.us) {
        playAudio(card.audio.us)
      }

      if ((event.key === 'm' || event.key === 'M') && tts) {
        playAudio(tts)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [card, flip, goNext, goPrev])

  if (!card) return null

  const progress = rows.length ? ((index + 1) / rows.length) * 100 : 0

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 pb-4 sm:gap-5">
      {/* Progress Bar */}
      <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 shadow-2xs sm:px-4">
        <span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-extrabold tabular-nums text-emerald-700">
          {index + 1} / {rows.length}
        </span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="shrink-0 text-xs font-semibold text-slate-400">
          {Math.round(progress)}%
        </span>
      </div>

      {practiceMode === 'flashcard' ? (
        <>
          <div className="w-full">
            <Flashcard card={card} flipped={flipped} onFlip={flip} />
          </div>

          <div className="grid w-full grid-cols-3 gap-2.5 sm:max-w-md sm:gap-3">
            <Button
              onClick={goPrev}
              disabled={index === 0}
              variant="outline"
              className="h-11 rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <ArrowLeft size={16} /> Trước
            </Button>
            <Button
              onClick={flip}
              className="h-11 rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              Lật thẻ
            </Button>
            <Button
              onClick={goNext}
              disabled={index >= rows.length - 1}
              variant="outline"
              className="h-11 rounded-2xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              Tiếp <ArrowRight size={16} />
            </Button>
          </div>

          <div className="hidden flex-wrap justify-center gap-x-4 gap-y-2 pt-1 sm:flex">
            <KbdHint keys={['Space']} label="Lật thẻ" />
            <KbdHint keys={['←', 'H']} label="Quay lại" />
            <KbdHint keys={['→', 'L']} label="Tiếp theo" />
            <KbdHint keys={['U']} label="Nghe UK" />
            <KbdHint keys={['A']} label="Nghe US" />
            <KbdHint keys={['M']} label="Nghe nghĩa" />
          </div>
        </>
      ) : (
        <TypingReviewCard
          key={card.userWordId}
          card={card}
          index={index}
          answer={typingAnswers[index] ?? ''}
          checked={typingChecked[index] ?? false}
          correct={
            (typingAnswers[index] ?? '').trim().toLowerCase() ===
            card.word.trim().toLowerCase()
          }
          showVietnamese={showVietnamese}
          onToggleVietnamese={() => setShowVietnamese(value => !value)}
          onAnswer={handleTypingAnswer}
          onCheck={handleTypingCheck}
          onPrevious={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  )
}
