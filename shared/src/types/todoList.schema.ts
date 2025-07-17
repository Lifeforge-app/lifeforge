/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: todoList
 * Generated at: 2025-07-17T08:55:29.693Z
 * Contains: todo_list__lists, todo_list__tags, todo_list__entries, todo_list__priorities, todo_list__lists_aggregated, todo_list__tags_aggregated, todo_list__priorities_aggregated
 */
import { z } from 'zod/v4'

const ListSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string()
})

const TagSchema = z.object({
  name: z.string()
})

const EntrySchema = z.object({
  summary: z.string(),
  notes: z.string(),
  due_date: z.string(),
  due_date_has_time: z.boolean(),
  list: z.string(),
  tags: z.array(z.string()),
  priority: z.string(),
  done: z.boolean(),
  completed_at: z.string()
})

const PrioritySchema = z.object({
  name: z.string(),
  color: z.string(),
  amount: z.number()
})

const ListAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  amount: z.number()
})

const TagAggregatedSchema = z.object({
  name: z.string(),
  amount: z.number()
})

const PriorityAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  amount: z.number()
})

type IList = z.infer<typeof ListSchema>
type ITag = z.infer<typeof TagSchema>
type IEntry = z.infer<typeof EntrySchema>
type IPriority = z.infer<typeof PrioritySchema>
type IListAggregated = z.infer<typeof ListAggregatedSchema>
type ITagAggregated = z.infer<typeof TagAggregatedSchema>
type IPriorityAggregated = z.infer<typeof PriorityAggregatedSchema>

export {
  ListSchema,
  TagSchema,
  EntrySchema,
  PrioritySchema,
  ListAggregatedSchema,
  TagAggregatedSchema,
  PriorityAggregatedSchema
}

export type {
  IList,
  ITag,
  IEntry,
  IPriority,
  IListAggregated,
  ITagAggregated,
  IPriorityAggregated
}

// -------------------- CUSTOM SCHEMAS --------------------

const TodoListStatusCounterSchema = z.object({
  all: z.number(),
  today: z.number(),
  scheduled: z.number(),
  overdue: z.number(),
  completed: z.number()
})

type ITodoListStatusCounter = z.infer<typeof TodoListStatusCounterSchema>

export { TodoListStatusCounterSchema }

export type { ITodoListStatusCounter }
