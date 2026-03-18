import { Link } from '@tanstack/react-router'
import { ClipboardList, Loader2, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '../../../shared/constants/routes'
import { submitBulkQuiz, useQuizQueue } from '../hooks/use-quiz'
import { QuestionCard } from './QuestionCard'
import { ScoreScreen } from './ScoreScreen'
import { buildQuestions, playAudio } from './utils'

export function QuizPage() {
  const { isLoggedIn, rows, isLoading, isError, error, refetch } = useQuizQueue({
    page: 1,
    pageSize: 20,
  })

  const questions = useMemo(() => (rows.length ? buildQuestions(rows) : []), [rows])

  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [score, setScore] = useState<{ total: number; correct: number } | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (questions.length) {
      setAnswers(new Array(questions.length).fill(null))
      setQuestionIndex(0)
      setSubmitted(false)
      setScore(null)
      startTimeRef.current = Date.now()
    }
  }, [questions])

  const handleAnswer = useCallback((i: number) => {
    setAnswers(prev => {
      if (prev[questionIndex] !== null) return prev
      const next = [...prev]
      next[questionIndex] = i
      return next
    })
  }, [questionIndex])

  const handleNext = useCallback(async () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(v => v + 1)
      return
    }

    setSubmitting(true)
    try {
      const results = questions.map((q, i) => ({
        userWordId: q.card.userWordId,
        correct: answers[i] === q.correctIndex,
      }))
      const durationSeconds = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : undefined
      const res = await submitBulkQuiz({ results, durationSeconds })
      setScore({ total: res.total, correct: res.correct })
    } catch {
      const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length
      setScore({ total: questions.length, correct })
    } finally {
      setSubmitted(true)
      setSubmitting(false)
    }
  }, [answers, questionIndex, questions])

  const handleRetry = useCallback(() => {
    setQuestionIndex(0)
    setAnswers(new Array(questions.length).fill(null))
    setSubmitted(false)
    setScore(null)
    startTimeRef.current = Date.now()
  }, [questions.length])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const question = questions[questionIndex]
      if (!question) return

      const isAnswered = answers[questionIndex] !== null

      if (!isAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const i = parseInt(e.key, 10) - 1
          if (i < question.choices.length) handleAnswer(i)
        }
        if ((e.key === 'u' || e.key === 'U') && question.card.audio.uk) playAudio(question.card.audio.uk)
        if ((e.key === 'a' || e.key === 'A') && question.card.audio.us) playAudio(question.card.audio.us)
        return
      }

      if ((e.code === 'Enter' || e.code === 'ArrowRight') && !submitting) {
        e.preventDefault()
        void handleNext()
      }
      if ((e.key === 'u' || e.key === 'U') && question.card.audio.uk) playAudio(question.card.audio.uk)
      if ((e.key === 'a' || e.key === 'A') && question.card.audio.us) playAudio(question.card.audio.us)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answers, handleAnswer, handleNext, questionIndex, questions, submitting])

  // — Guard states —
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <ClipboardList size={40} className="text-zinc-300" />
        <p className="font-medium text-zinc-500">Vui lòng đăng nhập để làm bài kiểm tra.</p>
        <Link to={ROUTES.LOGIN} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
          Đi tới đăng nhập
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-red-500">{(error as Error)?.message ?? 'Lỗi tải dữ liệu. Vui lòng thử lại.'}</p>
        <Button onClick={() => void refetch()} variant="outline">Thử lại</Button>
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
          <ClipboardList size={32} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-800">Không có từ nào cần kiểm tra hôm nay.</h2>
        <p className="text-sm text-zinc-400">Hãy thêm từ mới vào từ vựng của bạn.</p>
        <Link to={ROUTES.VOCABULARY} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
          Xem từ vựng
        </Link>
      </div>
    )
  }

  if (submitting) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-emerald-500" />
        <p className="text-sm text-zinc-400">Đang lưu kết quả...</p>
      </div>
    )
  }

  if (submitted && score) {
    return <ScoreScreen total={score.total} correct={score.correct} onRetry={handleRetry} />
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-lg font-bold text-zinc-900">
              <ClipboardList size={18} className="text-emerald-600" />
              Kiểm tra
            </h1>
            <p className="text-xs text-zinc-400">Ghép từ với nghĩa đúng — {questions.length} câu hỏi</p>
          </div>
          <Link
            to={ROUTES.REVIEW}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            <RotateCcw size={14} /> Ôn flashcard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
        {questions[questionIndex] && (
          <QuestionCard
            question={questions[questionIndex]}
            index={questionIndex}
            total={questions.length}
            answered={answers[questionIndex] ?? null}
            onAnswer={handleAnswer}
            onNext={() => void handleNext()}
          />
        )}
      </div>
    </div>
  )
}
