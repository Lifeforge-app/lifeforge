import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export type Task = InferOutput<typeof forgeAPI.entries.getById>

export type TaskStatusCounter = InferOutput<
  typeof forgeAPI.entries.getStatusCounter
>
