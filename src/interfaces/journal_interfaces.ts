import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface IJournalEntry extends BasePBCollection {
  title: string
  content: string
  mood: {
    text: string
    emoji: string
  }
}

export type { IJournalEntry }
