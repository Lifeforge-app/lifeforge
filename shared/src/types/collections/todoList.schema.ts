/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: todoList
 * Generated at: 2025-07-19T14:07:18.233Z
 * Contains: todo_list__lists, todo_list__tags, todo_list__entries, todo_list__priorities, todo_list__lists_aggregated, todo_list__tags_aggregated, todo_list__priorities_aggregated
 */

import { z } from "zod/v4";

const List = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

const Tag = z.object({
  name: z.string(),
});

const Entry = z.object({
  summary: z.string(),
  notes: z.string(),
  due_date: z.string(),
  due_date_has_time: z.boolean(),
  list: z.string(),
  tags: z.array(z.string()),
  priority: z.string(),
  done: z.boolean(),
  completed_at: z.string(),
});

const Priority = z.object({
  name: z.string(),
  color: z.string(),
  amount: z.number(),
});

const ListAggregated = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  amount: z.number(),
});

const TagAggregated = z.object({
  name: z.string(),
  amount: z.number(),
});

const PriorityAggregated = z.object({
  name: z.string(),
  color: z.string(),
  amount: z.number(),
});

type IList = z.infer<typeof List>;
type ITag = z.infer<typeof Tag>;
type IEntry = z.infer<typeof Entry>;
type IPriority = z.infer<typeof Priority>;
type IListAggregated = z.infer<typeof ListAggregated>;
type ITagAggregated = z.infer<typeof TagAggregated>;
type IPriorityAggregated = z.infer<typeof PriorityAggregated>;

export {
  List,
  Tag,
  Entry,
  Priority,
  ListAggregated,
  TagAggregated,
  PriorityAggregated,
};

export type {
  IList,
  ITag,
  IEntry,
  IPriority,
  IListAggregated,
  ITagAggregated,
  IPriorityAggregated,
};

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
