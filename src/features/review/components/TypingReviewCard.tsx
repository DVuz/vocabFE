import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lightbulb,
  Pause,
  Play,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CEFR_CLASS, POS_CLASS } from '../../vocab/components/constants'
import { playAudio } from '../../quiz/components/utils'
import type { ReviewCard } from '../types/review.types'

interface TypingReviewCardProps {
  card: ReviewCard
  index: number
  answer: string
  checked: boolean
  correct: boolean
  onAnswer: (answer: string) => void
  onCheck: () => void
  onPrevious: () => void
  onNext: () => void
  showVietnamese: boolean
  onToggleVietnamese: () => void
}

function maskWordInExample(example: string, word: string): string {
  if (!word.trim()) return example
  const escaped = word.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escaped}(?:s|es|ed|ing|d)?\\b`, 'gi')
  return example.replace(regex, '_____')
}

export function TypingReviewCard({
  card,
  index,
  answer,
  checked,
  correct,
  onAnswer,
  onCheck,
  onPrevious,
  onNext,
  showVietnamese,
  onToggleVietnamese,
}: TypingReviewCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const meaningAudioRef = useRef<HTMLAudioElement | null>(null)
  const [meaningAudioPlaying, setMeaningAudioPlaying] = useState(false)
  const [hideDefinition, setHideDefinition] = useState(false)
  const [showUkIpa, setShowUkIpa] = useState(false)
  const [showUsIpa, setShowUsIpa] = useState(false)
  const [revealFirst, setRevealFirst] = useState(false)
  const [revealLast, setRevealLast] = useState(false)

  const meaningAudioUrl = card.audio.tts ?? null

  const hintChars = useMemo(() => {
    return card.word.split('').map((letter, letterIndex) => {
      if (letter === ' ' || letter === '-') return letter
      const shouldReveal =
        (revealFirst && letterIndex === 0) ||
        (revealLast && letterIndex === card.word.length - 1)
      return shouldReveal ? letter : '_'
    })
  }, [card.word, revealFirst, revealLast])

  useEffect(() => {
    inputRef.current?.focus()
    if (!meaningAudioUrl) return

    const audio = new Audio(meaningAudioUrl)
    meaningAudioRef.current = audio
    audio.onended = () => setMeaningAudioPlaying(false)
    audio.onerror = () => setMeaningAudioPlaying(false)

    void audio
      .play()
      .then(() => setMeaningAudioPlaying(true))
      .catch(() => setMeaningAudioPlaying(false))

    return () => {
      audio.pause()
      audio.onended = null
      audio.onerror = null
    }
  }, [meaningAudioUrl])

  const toggleMeaningAudio = () => {
    const audio = meaningAudioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio
        .play()
        .then(() => setMeaningAudioPlaying(true))
        .catch(() => setMeaningAudioPlaying(false))
    } else {
      audio.pause()
      setMeaningAudioPlaying(false)
    }
  }

  const maskedExample = useMemo(() => {
    if (!card.examples.length) return null
    return checked
      ? card.examples[0]
      : maskWordInExample(card.examples[0], card.word)
  }, [card.examples, card.word, checked])

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-md sm:p-7">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {card.cefrLevel && (
              <span
                className={`rounded-md border px-2 py-0.5 text-xs font-bold ${
                  CEFR_CLASS[card.cefrLevel] ??
                  'border-slate-200 bg-slate-100 text-slate-600'
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
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              <Lightbulb size={12} className="text-amber-500" />
              {card.word.length} ký tự
            </span>
          </div>

          {meaningAudioUrl && (
            <button
              type="button"
              onClick={() => setHideDefinition(v => !v)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              {hideDefinition ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{hideDefinition ? 'Hiện định nghĩa' : 'Chế độ nghe'}</span>
            </button>
          )}
        </div>

        {/* Prompt Area */}
        <div className="my-5 flex flex-col items-center gap-3.5 text-center sm:my-6">
          {meaningAudioUrl && (
            <button
              type="button"
              onClick={toggleMeaningAudio}
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs font-bold text-emerald-700 shadow-2xs transition hover:bg-emerald-100"
            >
              {meaningAudioPlaying ? (
                <Pause size={15} fill="currentColor" />
              ) : (
                <Play size={15} fill="currentColor" />
              )}
              <span>
                {meaningAudioPlaying ? 'Đang phát nghĩa...' : 'Nghe đọc định nghĩa'}
              </span>
            </button>
          )}

          {!hideDefinition ? (
            <p className="mx-auto max-w-xl text-lg font-bold leading-relaxed break-words text-slate-900 sm:text-xl">
              {card.definition}
            </p>
          ) : (
            <p className="text-sm italic text-slate-400">
              Định nghĩa đang được ẩn để luyện nghe. Nhấn "Hiện định nghĩa" nếu cần.
            </p>
          )}

          {showVietnamese && (
            <div className="w-full max-w-lg rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2 text-sm font-medium text-emerald-900">
              <Sparkles size={13} className="mr-1.5 inline text-emerald-600" />
              {card.vnDefinition ?? 'Chưa có nghĩa tiếng Việt'}
            </div>
          )}

          {maskedExample && (
            <p className="max-w-lg border-l-2 border-slate-200 pl-3 text-left text-xs italic leading-relaxed text-slate-500 sm:text-sm">
              "{maskedExample}"
            </p>
          )}

          {/* Character Hint Slots */}
          {(revealFirst || revealLast) && !checked && (
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {hintChars.map((ch, idx) => (
                <span
                  key={idx}
                  className={`inline-flex h-7 w-6 items-center justify-center rounded-md border font-mono text-xs font-bold ${
                    ch !== '_' && ch !== ' '
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  {ch}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Input + Submit Row */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Input
            ref={inputRef}
            value={answer}
            disabled={checked}
            onChange={event => onAnswer(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                if (!checked && answer.trim()) {
                  onCheck()
                } else if (checked) {
                  onNext()
                }
              }
            }}
            placeholder="Gõ từ tiếng Anh tương ứng..."
            className={`h-12 min-w-0 flex-1 rounded-2xl border-2 px-4 text-base font-medium transition ${
              checked
                ? correct
                  ? 'border-emerald-400 bg-emerald-50/70 text-emerald-900'
                  : 'border-rose-400 bg-rose-50/70 text-rose-900'
                : 'border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:bg-white'
            }`}
            aria-label="Đáp án tiếng Anh"
          />
          <Button
            onClick={checked ? onNext : onCheck}
            disabled={!checked && !answer.trim()}
            className="h-12 shrink-0 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 sm:px-5"
          >
            {checked ? (
              <>
                <span className="hidden sm:inline">Tiếp</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <span>Kiểm tra</span>
            )}
          </Button>
        </div>

        {/* Checked Feedback Banner */}
        {checked && (
          <div
            className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
              correct
                ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
                : 'border-rose-200 bg-rose-50/80 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {correct ? (
                <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
              ) : (
                <XCircle size={20} className="shrink-0 text-rose-600" />
              )}
              <div>
                <p className="text-sm font-bold">
                  {correct ? 'Chính xác tuyệt vời!' : 'Chưa chính xác'}
                </p>
                {!correct && (
                  <p className="text-xs sm:text-sm">
                    Đáp án đúng:{' '}
                    <strong className="font-extrabold underline decoration-rose-300 underline-offset-2">
                      {card.word}
                    </strong>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {card.audio.uk && (
                <button
                  type="button"
                  onClick={() => playAudio(card.audio.uk!)}
                  className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-white px-2.5 py-1 text-xs font-bold text-blue-700 shadow-2xs hover:bg-blue-50"
                >
                  <Volume2 size={13} /> UK
                </button>
              )}
              {card.audio.us && (
                <button
                  type="button"
                  onClick={() => playAudio(card.audio.us!)}
                  className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-white px-2.5 py-1 text-xs font-bold text-amber-700 shadow-2xs hover:bg-amber-50"
                >
                  <Volume2 size={13} /> US
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hint & Pronunciation Toolbar */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {card.ipa.uk && (
              <button
                type="button"
                onClick={() => setShowUkIpa(value => !value)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  showUkIpa
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                <span>UK {showUkIpa ? `/${card.ipa.uk}/` : 'IPA'}</span>
                {card.audio.uk && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={event => {
                      event.stopPropagation()
                      playAudio(card.audio.uk!)
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        event.stopPropagation()
                        playAudio(card.audio.uk!)
                      }
                    }}
                    className="inline-flex text-blue-500 hover:text-blue-700"
                    aria-label="Phát âm UK"
                  >
                    <Volume2 size={13} />
                  </span>
                )}
              </button>
            )}

            {card.ipa.us && (
              <button
                type="button"
                onClick={() => setShowUsIpa(value => !value)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  showUsIpa
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-200 hover:text-amber-600'
                }`}
              >
                <span>US {showUsIpa ? `/${card.ipa.us}/` : 'IPA'}</span>
                {card.audio.us && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={event => {
                      event.stopPropagation()
                      playAudio(card.audio.us!)
                    }}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        event.stopPropagation()
                        playAudio(card.audio.us!)
                      }
                    }}
                    className="inline-flex text-amber-500 hover:text-amber-700"
                    aria-label="Phát âm US"
                  >
                    <Volume2 size={13} />
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setRevealFirst(value => !value)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                revealFirst
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-200 hover:text-emerald-700'
              }`}
            >
              {revealFirst ? 'Đã mở chữ đầu' : 'Gợi ý chữ đầu'}
            </button>

            <button
              type="button"
              onClick={() => setRevealLast(value => !value)}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                revealLast
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-200 hover:text-emerald-700'
              }`}
            >
              {revealLast ? 'Đã mở chữ cuối' : 'Gợi ý chữ cuối'}
            </button>

            <button
              type="button"
              onClick={onToggleVietnamese}
              className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                showVietnamese
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-emerald-200 hover:text-emerald-700'
              }`}
            >
              <Eye size={13} />
              <span>{showVietnamese ? 'Ẩn nghĩa Việt' : 'Nghĩa tiếng Việt'}</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <Button
            onClick={onPrevious}
            disabled={index === 0}
            variant="outline"
            className="h-10 rounded-xl border-slate-200 px-4 text-xs font-semibold sm:text-sm"
          >
            <ArrowLeft size={16} /> Câu trước
          </Button>
          <Button
            onClick={onNext}
            variant="outline"
            className="h-10 rounded-xl border-slate-200 px-4 text-xs font-semibold sm:text-sm"
          >
            {checked ? 'Câu tiếp theo' : 'Bỏ qua'} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
