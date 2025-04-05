import type { RecordModel } from 'pocketbase'

interface ITodoListEntry extends RecordModel {
  due_date: string
  due_date_has_time: boolean
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

interface ITodoPriority extends RecordModel {
  color: string
  name: string
  amount: number
}

interface ITodoListList extends RecordModel {
  color: string
  icon: string
  name: string
  amount: number
}

interface ITodoListTag extends RecordModel {
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
  ITodoListList,
  ITodoListStatusCounter,
  ITodoListTag,
  ITodoPriority,
  ITodoSubtask
}
