import { Link } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '../../../shared/constants/routes'

interface ScoreScreenProps {
  total: number
  correct: number
  onRetry: () => void
}

export function ScoreScreen({ total, correct, onRetry }: ScoreScreenProps) {
  const percent = total ? Math.round((correct / total) * 100) : 0
  const emoji = percent >= 80 ? '🎉' : percent >= 50 ? '💪' : '📚'

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-50 text-5xl shadow-sm">
        {emoji}
      </div>
      <div>
        <h2 className="mb-1 text-3xl font-extrabold text-zinc-900">{correct} / {total} đúng</h2>
        <p className="text-sm text-zinc-400">Tỷ lệ chính xác: {percent}%</p>
      </div>
      <div className="w-full max-w-xs">
        <div className="h-3 overflow-hidden rounded-full bg-zinc-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-amber-400' : 'bg-red-400'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={onRetry} variant="outline" className="rounded-xl">
          <RotateCcw size={15} /> Làm lại
        </Button>
        <Link
          to={ROUTES.REVIEW}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Ôn tập lại
        </Link>
      </div>
    </div>
  )
}
