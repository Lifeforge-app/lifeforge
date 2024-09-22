import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface ITodoListEntry extends BasePBCollection {
  due_date: string
  list: string
  notes: string
  priority: string
  summary: string
  tags: string[]
  done: boolean
  completed_at: string
  subtasks: ITodoSubtask[]
}

interface ITodoSubtask {
  id: string
  title: string
  done: boolean
  hasChanged?: boolean
}

interface ITodoPriority extends BasePBCollection {
  color: string
  name: string
  amount: number
}

interface ITodoListList extends BasePBCollection {
  color: string
  icon: string
  name: string
  amount: number
}

interface ITodoListTag extends BasePBCollection {
  amount: number
  color: string
  name: string
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
  ITodoSubtask,
  ITodoPriority,
  ITodoListList,
  ITodoListTag,
  ITodoListStatusCounter
}
