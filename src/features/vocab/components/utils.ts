import { STATUS_CLASS } from './constants'

export function playAudio(url: string) {
  const audio = new Audio(url)
  void audio.play()
}

export function statusClasses(status: string | null) {
  return STATUS_CLASS[status ?? 'new'] ?? 'bg-zinc-50 text-zinc-600 border-zinc-200'
}

export function getVisiblePages(page: number, totalPages: number) {
  const delta = 2
  const start = Math.max(1, page - delta)
  const end = Math.min(totalPages, page + delta)

  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)

  return pages
}
