import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface IJournalEntry extends BasePBCollection {
  title: string
  content: string
}

export type { IJournalEntry }
