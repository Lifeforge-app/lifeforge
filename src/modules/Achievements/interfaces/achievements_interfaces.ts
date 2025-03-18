import type { RecordModel } from 'pocketbase'

interface IAchievementEntry extends RecordModel {
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

type IAchievementEntryFormState = {
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

export type { IAchievementEntry, IAchievementEntryFormState }
