import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface IJournalEntry extends BasePBCollection {
  date: string
  content: string
  raw: string
  summary: string
  mood: {
    text: string
    emoji: string
  }
}

export type { IJournalEntry }
