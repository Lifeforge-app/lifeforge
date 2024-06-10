import type BasePBCollection from './Pocketbase'

interface IJournalEntry extends BasePBCollection {
  title: string
  content: string
}

export type { IJournalEntry }
