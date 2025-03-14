import type BasePBCollection from '@interfaces/pb_interfaces'

interface IAchievementEntry extends BasePBCollection {
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

interface IAchievementEntryFormState {
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

export type { IAchievementEntry, IAchievementEntryFormState }
