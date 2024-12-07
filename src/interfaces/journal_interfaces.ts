import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface IJournalEntry extends BasePBCollection {
  date: string
  title: string
  content: string
  raw: string
  summary: string
  wordCount?: number
  mood: {
    text: string
    emoji: string
  }
  photos: string[]
  token?: string
}

export type { IJournalEntry }
