import { ZodObject, ZodRawShape } from 'zod'

// Simple intersection type approach
type FlattenSchemas<T extends Record<string, Record<string, unknown>>> =
  UnionToIntersection<
    {
      [K1 in keyof T]: {
        [K2 in keyof T[K1]]: Record<`${string & K1}__${string & K2}`, T[K1][K2]>
      }[keyof T[K1]]
    }[keyof T]
  >

// Helper type to convert union to intersection
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export default function flattenSchemas<
  T extends Record<string, Record<string, ZodObject<ZodRawShape>>>
>(schemas: T): FlattenSchemas<T> {
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
