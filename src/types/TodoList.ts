interface ITodoListEntryItem {
  collectionId: string
  collectionName: string
  created: string
  due_date: string
  id: string
  list: string
  notes: string
  priority: string
  summary: string
  tags: string[]
  updated: string
  done: boolean
}

interface ITodoListEntry {
  done: ITodoListEntryItem[]
  pending: ITodoListEntryItem[]
}

interface ITodoListList {
  collectionId: string
  collectionName: string
  color: string
  created: string
  icon: string
  id: string
  name: string
  updated: string
  amount: number
}

interface ITodoListTag {
  amount: number
  collectionId: string
  collectionName: string
  color: string
  created: string
  id: string
  name: string
  updated: string
}

export type { ITodoListEntryItem, ITodoListEntry, ITodoListList, ITodoListTag }
