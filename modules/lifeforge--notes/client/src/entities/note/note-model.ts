import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export type Note = InferOutput<typeof forgeAPI.notes.list>[number]
