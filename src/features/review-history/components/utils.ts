export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return '—'
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}p ${s}s` : `${m} phút`
}

export function scoreTone(percent: number | null): string {
  if (percent === null) return 'bg-zinc-100 text-zinc-600 border-zinc-200'
  if (percent >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (percent >= 50) return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-red-100 text-red-700 border-red-200'
}
