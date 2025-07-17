/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: todoList
 * Generated at: 2025-07-09T12:50:41.283Z
 * Contains: todo_list__lists, todo_list__tags, todo_list__entries, todo_list__priorities, todo_list__lists_aggregated, todo_list__tags_aggregated, todo_list__priorities_aggregated
 */
import { z } from "zod/v4";

const TodoListListSchema = z.object({
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

const TodoListTagSchema = z.object({
  name: z.string(),
});

const TodoListEntrySchema = z.object({
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

const TodoListPrioritySchema = z.object({
  name: z.string(),
  color: z.string(),
  amount: z.number(),
});

const TodoListListAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string(),
  amount: z.number(),
});

const TodoListTagAggregatedSchema = z.object({
  name: z.string(),
  amount: z.number(),
});

const TodoListPriorityAggregatedSchema = z.object({
  name: z.string(),
  color: z.string(),
  amount: z.number(),
});

type ITodoListList = z.infer<typeof TodoListListSchema>;
type ITodoListTag = z.infer<typeof TodoListTagSchema>;
type ITodoListEntry = z.infer<typeof TodoListEntrySchema>;
type ITodoListPriority = z.infer<typeof TodoListPrioritySchema>;
type ITodoListListAggregated = z.infer<typeof TodoListListAggregatedSchema>;
type ITodoListTagAggregated = z.infer<typeof TodoListTagAggregatedSchema>;
type ITodoListPriorityAggregated = z.infer<
  typeof TodoListPriorityAggregatedSchema
>;

export {
  TodoListListSchema,
  TodoListTagSchema,
  TodoListEntrySchema,
  TodoListPrioritySchema,
  TodoListListAggregatedSchema,
  TodoListTagAggregatedSchema,
  TodoListPriorityAggregatedSchema,
};

export type {
  ITodoListList,
  ITodoListTag,
  ITodoListEntry,
  ITodoListPriority,
  ITodoListListAggregated,
  ITodoListTagAggregated,
  ITodoListPriorityAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

const TodoListStatusCounterSchema = z.object({
  all: z.number(),
  today: z.number(),
  scheduled: z.number(),
  overdue: z.number(),
  completed: z.number(),
});

type ITodoListStatusCounter = z.infer<typeof TodoListStatusCounterSchema>;

export { TodoListStatusCounterSchema };

export type { ITodoListStatusCounter };
