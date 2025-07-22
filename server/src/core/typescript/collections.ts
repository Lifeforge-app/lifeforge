import { z } from 'zod/v4'

export const SCHEMAS = {
  achievements: {
    entries: z.object({
      title: z.string(),
      thoughts: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard', 'impossible'])
    })
  }
}

type FlattenSchemas<T> = {
  [K1 in keyof T]: {
    [K2 in keyof T[K1]]: T[K1][K2]
  }[keyof T[K1]] extends infer V
    ? Record<`${string & K1}__${string & keyof T[K1]}`, V>
    : never
}[keyof T]

function flattenSchemas<T extends Record<string, Record<string, unknown>>>(
  schemas: T
): FlattenSchemas<T> {
  const flattened = {} as FlattenSchemas<T>

  for (const [level1, level2Obj] of Object.entries(schemas)) {
    for (const [level2, schema] of Object.entries(level2Obj)) {
      const key = `${level1}__${level2}`

      flattened[key as keyof FlattenSchemas<T>] =
        schema as FlattenSchemas<T>[keyof FlattenSchemas<T>]
    }
  }

  return flattened
}

const FLATTENED_SCHEMAS = flattenSchemas(SCHEMAS)
