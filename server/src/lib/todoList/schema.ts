import { z } from "zod/v4";

const todoListSchemas = {
  lists: z.object({
    name: z.string(),
    icon: z.string(),
    color: z.string(),
  }),
  tags: z.object({
    name: z.string(),
  }),
  entries: z.object({
    summary: z.string(),
    notes: z.string(),
    due_date: z.string(),
    due_date_has_time: z.boolean(),
    list: z.string(),
    tags: z.array(z.string()),
    priority: z.string(),
    done: z.boolean(),
    completed_at: z.string(),
    created: z.string(),
    updated: z.string(),
  }),
  priorities: z.object({
    name: z.string(),
    color: z.string(),
  }),
  lists_aggregated: z.object({
    name: z.string(),
    color: z.string(),
    icon: z.string(),
    amount: z.number(),
  }),
  tags_aggregated: z.object({
    name: z.string(),
    amount: z.number(),
  }),
  priorities_aggregated: z.object({
    name: z.string(),
    color: z.string(),
    amount: z.number(),
  }),
};

export default todoListSchemas;
