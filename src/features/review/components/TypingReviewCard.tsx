import { ArrowLeft, ArrowRight, Eye, Lightbulb, Pause, Play, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CEFR_CLASS } from '../../vocab/components/constants'
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
  const [showDefinition, setShowDefinition] = useState(false)
  const [showUkIpa, setShowUkIpa] = useState(false)
  const [showUsIpa, setShowUsIpa] = useState(false)
  const [revealFirst, setRevealFirst] = useState(false)
  const [revealLast, setRevealLast] = useState(false)
  const meaningAudioUrl = card.audio.tts ?? null
  const hint = card.word
    .split('')
    .map((letter, letterIndex) => {
      const shouldReveal =
        (revealFirst && letterIndex === 0) ||
        (revealLast && letterIndex === card.word.length - 1)
      return shouldReveal ? letter : '_'
    })
    .join(' ')

  useEffect(() => {
    inputRef.current?.focus()
    meaningAudioRef.current?.pause()
    // Reset playback state when the card changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeaningAudioPlaying(false)

    if (!meaningAudioUrl) return
    const audio = new Audio(meaningAudioUrl)
    meaningAudioRef.current = audio
    audio.onended = () => setMeaningAudioPlaying(false)
    void audio.play().then(() => setMeaningAudioPlaying(true)).catch(() => setMeaningAudioPlaying(false))

    return () => {
      audio.pause()
      audio.onended = null
    }
  }, [card.userWordId, meaningAudioUrl])

  const toggleMeaningAudio = () => {
    const audio = meaningAudioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio.play().then(() => setMeaningAudioPlaying(true)).catch(() => setMeaningAudioPlaying(false))
    } else {
      audio.pause()
      setMeaningAudioPlaying(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg sm:p-7">
        <div className="flex flex-wrap justify-center gap-2">
          {/* <span className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
            Nghĩa → Gõ từ
          </span> */}
          {card.cefrLevel && (
            <span className={`rounded border px-2.5 py-1 text-xs font-bold ${CEFR_CLASS[card.cefrLevel] ?? 'border-zinc-200 bg-zinc-50 text-zinc-500'}`}>
              {card.cefrLevel}
            </span>
          )}
        </div>

        <div className="mt-6 text-center">
          {meaningAudioUrl && !showDefinition ? (
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={toggleMeaningAudio}
                className="flex size-14 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                aria-label={meaningAudioPlaying ? 'Tạm dừng audio nghĩa' : 'Phát audio nghĩa'}
              >
                {meaningAudioPlaying ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}
              </button>
              <p className="text-sm font-medium text-zinc-500">Nghe audio để đoán từ</p>
            </div>
          ) : (
            <p className="mx-auto max-w-xl text-2xl font-bold leading-relaxed text-zinc-900">
              {card.definition}
            </p>
          )}

          {meaningAudioUrl && (
            <button
              type="button"
              onClick={() => setShowDefinition(value => !value)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Eye size={15} />
              {showDefinition ? 'Ẩn nghĩa tiếng Anh' : 'Hiện nghĩa tiếng Anh'}
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Input
            ref={inputRef}
            value={answer}
            disabled={checked}
            onChange={event => onAnswer(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter' && !checked && answer.trim()) onCheck()
            }}
            placeholder="Nhập từ tiếng Anh..."
            className={`h-12 min-w-0 flex-1 rounded-xl border-2 px-4 text-base ${
              checked
                ? correct
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : 'border-red-400 bg-red-50 text-red-800'
                : 'border-zinc-200 focus:border-emerald-400'
            }`}
            aria-label="Đáp án tiếng Anh"
          />
          <Button
            onClick={checked ? onNext : onCheck}
            disabled={!checked && !answer.trim()}
            className="size-12 shrink-0 rounded-xl bg-emerald-600 p-0 hover:bg-emerald-700"
            aria-label={checked ? 'Tiếp theo' : 'Kiểm tra'}
          >
            <ArrowRight size={20} />
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1"><Lightbulb size={14} /> {card.partOfSpeech ?? 'Từ tiếng Anh'}</span>
          {card.word.length > 0 && (
            <span className="rounded-lg bg-zinc-50 px-2.5 py-1 font-mono text-zinc-500">
              {revealFirst || revealLast ? hint : `${card.word.length} chữ cái`}
            </span>
          )}
        </div>

        {checked && (
          <p className={`mt-3 text-center text-sm font-semibold ${correct ? 'text-emerald-600' : 'text-red-600'}`}>
            {correct ? 'Chính xác!' : `Đáp án đúng: ${card.word}`}
          </p>
        )}

        <div className="mt-6 border-t border-zinc-100 pt-4">
          <div className="flex flex-wrap justify-center gap-2">
            {card.ipa.uk && (
              <button type="button" onClick={() => setShowUkIpa(value => !value)} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-blue-200 hover:text-blue-600">
                UK {showUkIpa ? `/${card.ipa.uk}/` : 'IPA'}
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
                    title="Phát âm UK"
                  >
                    <Volume2 size={13} />
                  </span>
                )}
              </button>
            )}
            {card.ipa.us && (
              <button type="button" onClick={() => setShowUsIpa(value => !value)} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-blue-200 hover:text-blue-600">
                US {showUsIpa ? `/${card.ipa.us}/` : 'IPA'}
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
                    title="Phát âm US"
                  >
                    <Volume2 size={13} />
                  </span>
                )}
              </button>
            )}
            <button type="button" onClick={() => setRevealFirst(value => !value)} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-emerald-200 hover:text-emerald-700">
              {revealFirst ? 'Đã mở chữ đầu' : 'Mở chữ đầu'}
            </button>
            <button type="button" onClick={() => setRevealLast(value => !value)} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-emerald-200 hover:text-emerald-700">
              {revealLast ? 'Đã mở chữ cuối' : 'Mở chữ cuối'}
            </button>
            <Button type="button" variant="ghost" onClick={onToggleVietnamese} className="h-8 rounded-full px-3 text-xs text-zinc-500">
              <Eye size={14} /> {showVietnamese ? 'Ẩn nghĩa Việt' : 'Nghĩa Việt'}
            </Button>
          </div>
          {showVietnamese && (
            <p className="mt-3 text-center text-sm text-zinc-600">{card.vnDefinition ?? 'Chưa có nghĩa tiếng Việt'}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
          <Button onClick={onPrevious} disabled={index === 0} variant="outline" className="rounded-xl">
            <ArrowLeft size={16} /> Trước
          </Button>
          <Button onClick={onNext} variant="outline" className="rounded-xl">
            {checked ? 'Tiếp theo' : 'Bỏ qua'} <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
