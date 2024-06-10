import type BasePBCollection from './Pocketbase'

interface IAchievementEntry extends BasePBCollection {
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

export type { IAchievementEntry }
