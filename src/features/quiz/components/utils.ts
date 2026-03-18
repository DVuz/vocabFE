import { DISTRACTOR_POOL } from '../constants/distractor-pool'
import type { QuizCard } from '../types/quiz.types'

export interface Question {
  card: QuizCard
  choices: string[]
  correctIndex: number
}

export function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function buildQuestions(cards: QuizCard[]): Question[] {
  const usedDefinitions = new Set(cards.map(c => c.definition))
  const filteredPool = shuffle(DISTRACTOR_POOL.filter(d => !usedDefinitions.has(d)))

  return cards.map((card, cardIndex) => {
    const otherDefs = shuffle(
      cards.filter(c => c.userWordId !== card.userWordId).map(c => c.definition),
    )

    const distractors: string[] = []
    for (const d of otherDefs) {
      if (!distractors.includes(d)) distractors.push(d)
      if (distractors.length === 3) break
    }

    if (distractors.length < 3) {
      const offset = (cardIndex * 3) % Math.max(filteredPool.length, 1)
      const wrapped = [...filteredPool.slice(offset), ...filteredPool.slice(0, offset)]
      for (const d of wrapped) {
        if (d !== card.definition && !distractors.includes(d)) distractors.push(d)
        if (distractors.length === 3) break
      }
    }

    const choices = shuffle([card.definition, ...distractors].slice(0, 4))
    return { card, choices, correctIndex: choices.indexOf(card.definition) }
  })
}

export function playAudio(url: string) {
  const audio = new Audio(url)
  void audio.play()
}
