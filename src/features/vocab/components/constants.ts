export const STATUS_LABEL: Record<string, string> = {
  new: 'Mới',
  learning: 'Đang học',
  familiar: 'Quen',
  review: 'Ôn tập',
  mastered: 'Thành thạo',
  forgotten: 'Quên',
}

export const STATUS_CLASS: Record<string, string> = {
  new: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  learning: 'bg-transparent text-blue-600 border-0',
  familiar: 'bg-amber-50 text-amber-600 border-amber-200',
  review: 'bg-purple-50 text-purple-700 border-purple-200',
  mastered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  forgotten: 'bg-red-50 text-red-600 border-red-200',
}

export const CEFR_CLASS: Record<string, string> = {
  A1: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  A2: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  B1: 'bg-blue-50 text-blue-700 border-blue-200',
  B2: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  C1: 'bg-purple-50 text-purple-700 border-purple-200',
  C2: 'bg-pink-50 text-pink-700 border-pink-200',
}

export const POS_CLASS: Record<string, string> = {
  noun: 'bg-blue-100 text-blue-700',
  verb: 'bg-emerald-100 text-emerald-700',
  adjective: 'bg-amber-100 text-amber-700',
  adverb: 'bg-purple-100 text-purple-700',
  'plural noun': 'bg-sky-100 text-sky-700',
  pronoun: 'bg-orange-100 text-orange-700',
  preposition: 'bg-pink-100 text-pink-700',
  conjunction: 'bg-lime-100 text-lime-700',
  interjection: 'bg-red-100 text-red-700',
}
