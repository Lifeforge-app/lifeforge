import { z } from 'zod'

export const taskInputSchema = z.object({
  summary: z.string().trim().min(1, 'Task summary cannot be empty.'),
  notes: z.string(),
  due_date: z.string(),
  due_date_has_time: z.boolean(),
  list: z.string(),
  tags: z.array(z.string()),
  priority: z.string().nullable()
})

export type TaskInput = z.infer<typeof taskInputSchema>

export function filterTasksBySummary<T extends { summary: string }>(
  tasks: T[],
  query: string
): T[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (normalizedQuery === '') return tasks

  return tasks.filter(task =>
    task.summary.toLowerCase().includes(normalizedQuery)
  )
}
