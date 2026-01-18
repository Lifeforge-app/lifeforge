import { ZodObject, ZodRawShape } from 'zod'

// Helper type to convert union to intersection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

type SchemaEntry = {
  schema: ZodObject<ZodRawShape>
  raw: unknown
}

export type RawSchemas = Record<string, SchemaEntry>

type SchemaOf<T> = T extends { schema: infer S } ? S : never

export type CleanedSchemas<T = {}> = UnionToIntersection<
  {
    [K in keyof T]: {
      [P in K]: SchemaOf<T[K]>
    }
  }[keyof T]
>

export function cleanSchemas<T extends RawSchemas>(
  schemas: T
): CleanedSchemas<T> {
  const out = {} as any

  for (const k in schemas) out[k] = schemas[k].schema

  return out
}
