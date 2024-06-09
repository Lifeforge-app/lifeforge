interface IAchievementEntry {
  collectionId: string
  collectionName: string
  created: string
  id: string
  updated: string
  title: string
  thoughts: string
  difficulty: 'easy' | 'medium' | 'hard' | 'impossible'
}

export type { IAchievementEntry }
