import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Layers,
  Loader2,
  RotateCcw,
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
// import { PaginationBar } from '../../vocab/components/PaginationBar'
import { CEFR_CLASS, STATUS_CLASS, STATUS_LABEL } from '../../vocab/components/constants'
import { useReviewFlashcards } from '../hooks/use-review-flashcards'
import type { ReviewCard, ReviewMode } from '../types/review.types'

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
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-3xl border border-zinc-200 bg-white px-8 py-10 shadow-xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {card.cefrLevel && (
              <span
                className={`rounded border px-2 py-0.5 text-xs font-bold ${CEFR_CLASS[card.cefrLevel] ?? 'border-zinc-200 bg-zinc-100 text-zinc-500'}`}
              >
                {card.cefrLevel}
              </span>
            )}
            {card.partOfSpeech && (
              <span className="rounded px-2 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-600">
                {card.partOfSpeech}
              </span>
            )}
            {card.status && (
              <span
                className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${STATUS_CLASS[card.status] ?? STATUS_CLASS.new}`}
              >
                {STATUS_LABEL[card.status] ?? card.status}
              </span>
            )}
          </div>

          <h2 className="text-center text-5xl font-black leading-tight tracking-tight text-zinc-900">
            {card.word}
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {card.ipa.uk && (
              <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5">
                <span className="text-[11px] font-bold uppercase text-blue-400">UK</span>
                <span className="font-mono text-sm text-blue-700">/{card.ipa.uk}/</span>
                {card.audio.uk && (
                  <button
                    onClick={event => {
                      event.stopPropagation()
                      playAudio(card.audio.uk!)
                    }}
                    className="text-blue-500 transition-colors hover:text-blue-700"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            )}
            {card.ipa.us && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-1.5">
                <span className="text-[11px] font-bold uppercase text-amber-400">US</span>
                <span className="font-mono text-sm text-amber-700">/{card.ipa.us}/</span>
                {card.audio.us && (
                  <button
                    onClick={event => {
                      event.stopPropagation()
                      playAudio(card.audio.us!)
                    }}
                    className="text-amber-500 transition-colors hover:text-amber-700"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="mt-2 text-sm text-zinc-400">Nhấn Space hoặc click để xem nghĩa</p>
        </div>

        <div
          className="absolute inset-0 flex flex-col justify-center gap-4 rounded-3xl border border-emerald-200 bg-white px-8 py-10 shadow-xl"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h3 className="text-center text-2xl font-bold text-zinc-900">{card.word}</h3>

          {ttsAudioUrl && (
            <div className="flex justify-center">
              <button
                onClick={event => {
                  event.stopPropagation()
                  playAudio(ttsAudioUrl)
                }}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                aria-label="Nghe nghĩa"
                title="Nghe nghĩa"
              >
                <Volume2 size={14} className="text-emerald-500" />
                Nghĩa
              </button>
            </div>
          )}

          <div className="space-y-2 border-t border-zinc-100 pt-4">
            <p className="text-center text-base font-semibold leading-relaxed text-zinc-800">
              {card.definition}
            </p>
            {card.vnDefinition && (
              <p className="text-center text-sm italic text-zinc-500">{card.vnDefinition}</p>
            )}
          </div>

          {card.examples.length > 0 && (
            <ul className="space-y-1.5 border-t border-zinc-100 pt-3">
              {card.examples.slice(0, 2).map((example, index) => (
                <li
                  key={index}
                  className="border-l-2 border-emerald-200 pl-3 text-xs italic text-zinc-500"
                >
                  \"{example}\"
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function KbdHint({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
      {keys.map(key => (
        <kbd
          key={key}
          className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-zinc-300 bg-white px-1.5 font-mono text-[11px] text-zinc-700 shadow-sm"
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

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const { isLoggedIn, rows, isFetching, isError, error, refetch } = useReviewFlashcards(mode, {
    page,
    pageSize,
    status: status === 'all' ? undefined : status,
  })

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
  }, [mode, page, rows])

  const card = rows[index]

  const modeTitle = useMemo(
    () => (mode === 'today' ? 'Danh sách đến hạn hôm nay' : 'Danh sách ôn tập ưu tiên'),
    [mode],
  )

  const goNext = useCallback(() => {
    if (index >= rows.length - 1) {
      return
    }

    setFlipped(false)
    setTimeout(() => setIndex(value => value + 1), 120)
  }, [index, rows.length])

  const goPrev = useCallback(() => {
    if (index <= 0) {
      return
    }

    setFlipped(false)
    setTimeout(() => setIndex(value => value - 1), 120)
  }, [index])

  const flip = useCallback(() => setFlipped(value => !value), [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tts = card?.audio?.tts
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault()
        flip()
      }

      if (event.code === 'ArrowRight' || event.key === 'l' || event.key === 'L') {
        event.preventDefault()
        goNext()
      }

      if (event.code === 'ArrowLeft' || event.key === 'h' || event.key === 'H') {
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

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <RotateCcw size={28} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-800">Đăng nhập để ôn tập</h2>
        <p className="text-sm text-zinc-400">Bạn cần đăng nhập để truy cập chế độ ôn tập flashcard.</p>
        <Link to={ROUTES.LOGIN} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
          Đi tới đăng nhập
        </Link>
      </div>
    )
  }

  const progress = rows.length ? ((index + 1) / rows.length) * 100 : 0

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-100 to-blue-50">
        <div className="mx-auto w-full max-w-400 px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800">Review Flashcards</h1>
                <p className="text-sm text-slate-500">{modeTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <Button
                variant={mode === 'today' ? 'default' : 'ghost'}
                className={mode === 'today' ? 'bg-slate-800 text-white hover:bg-slate-700' : 'text-slate-500'}
                onClick={() => {
                  setMode('today')
                  setPage(1)
                }}
              >
                <RotateCcw size={14} /> Đến hạn hôm nay
              </Button>
              <Button
                variant={mode === 'priority' ? 'default' : 'ghost'}
                className={mode === 'priority' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'text-slate-500'}
                onClick={() => {
                  setMode('priority')
                  setPage(1)
                }}
              >
                <Layers size={14} /> Ưu tiên ôn tập
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Select
              value={status}
              onValueChange={value => {
                if (!value) {
                  return
                }
                setStatus(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-44 bg-white text-sm">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
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
                if (!value) {
                  return
                }
                setPageSize(Number(value))
                setPage(1)
              }}
            >
              <SelectTrigger className="h-9 w-28 bg-white text-sm">
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

            <Link
              to={ROUTES.QUIZ}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
            >
              <ClipboardList size={14} /> Kiểm tra ngay
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-440 px-4 py-6 sm:px-6 lg:px-10">
        {isFetching && (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={30} className="animate-spin text-emerald-500" />
          </div>
        )}

        {!isFetching && isError && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <p className="text-sm text-red-500">{(error as Error)?.message ?? 'Lỗi tải dữ liệu ôn tập'}</p>
            <Button onClick={() => void refetch()} variant="outline">Thử lại</Button>
          </div>
        )}

        {!isFetching && !isError && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <BookOpen size={28} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-zinc-800">Không có từ cần ôn</h2>
            <p className="text-sm text-zinc-400">Hãy quay lại sau hoặc thêm từ mới vào danh sách học.</p>
            <Link to={ROUTES.VOCABULARY} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
              Mở danh sách từ vựng
            </Link>
          </div>
        )}

        {!isFetching && !isError && card && (
          <div className="flex flex-col items-center gap-6 pb-4">
            <div className="flex w-full max-w-2xl items-center gap-3">
              <span className="shrink-0 text-xs text-zinc-400">
                {index + 1} / {rows.length}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="w-full max-w-2xl">
              <Flashcard card={card} flipped={flipped} onFlip={flip} />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={goPrev} disabled={index === 0} variant="outline" className="rounded-xl">
                <ArrowLeft size={16} /> Trước
              </Button>
              <Button onClick={flip} className="rounded-xl bg-zinc-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700">
                Lật thẻ
              </Button>
              <Button
                onClick={goNext}
                disabled={index >= rows.length - 1}
                variant="outline"
                className="rounded-xl"
              >
                Tiếp theo <ArrowRight size={16} />
              </Button>
            </div>

            <div className="mt-1 flex flex-wrap justify-center gap-x-5 gap-y-2">
              <KbdHint keys={['Space']} label="Lật thẻ" />
              <KbdHint keys={['←', 'H']} label="Quay lại" />
              <KbdHint keys={['→', 'L']} label="Tiếp theo" />
              <KbdHint keys={['U']} label="Nghe UK" />
              <KbdHint keys={['A']} label="Nghe US" />
              <KbdHint keys={['M']} label="Nghe nghĩa" />
            </div>
          </div>
        )}

        {/* {pagination && (
          <PaginationBar
            page={pagination.page}
            totalPages={Math.max(pagination.totalPages, 1)}
            hasPrev={pagination.hasPrev}
            hasNext={pagination.hasNext}
            onPage={setPage}
          />
        )} */}
      </div>
    </div>
  )
}
