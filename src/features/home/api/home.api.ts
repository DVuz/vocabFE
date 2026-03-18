export const HOME_SUGGESTIONS = [
  'accommodation',
  'perseverance',
  'eloquent',
  'ephemeral',
  'serendipity',
] as const

export function normalizeSearchWord(value: string) {
  return value.trim()
}
