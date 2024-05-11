interface ITodoListEntry {
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
  completed_at: string
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

interface ITodoListStatusCounter {
  all: number
  today: number
  scheduled: number
  overdue: number
  completed: number
}

export type {
  ITodoListEntry,
  ITodoListList,
  ITodoListTag,
  ITodoListStatusCounter
}
