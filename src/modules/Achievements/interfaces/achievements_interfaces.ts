import type BasePBCollection from '@interfaces/pb_interfaces'

interface IAchievementEntry extends BasePBCollection {
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

type IAchievementEntryFormState = Omit<
  IAchievementEntry,
  keyof BasePBCollection
>

export type { IAchievementEntry, IAchievementEntryFormState }
