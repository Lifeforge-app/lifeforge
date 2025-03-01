import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface IAchievementEntry extends BasePBCollection {
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

interface IAchievementFormState {
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

export type { IAchievementEntry, IAchievementFormState }
