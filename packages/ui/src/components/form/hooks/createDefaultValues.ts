/**
 * ⚠️ WARNING
 *
 * Do not add business-specific defaults here.
 *
 * This utility only derives defaults from Zod types.
 *
 * Keep this utility dumb. Very dumb. Dumber than you think it should be.
 */
import { z } from 'zod'

export function createDefaultValues<TSchema extends z.ZodTypeAny>(
  schema: TSchema
): z.infer<TSchema> {
  if (schema instanceof z.ZodOptional) {
    return undefined as z.infer<TSchema>
  }

  if (schema instanceof z.ZodNullable) {
    return null as z.infer<TSchema>
  }

  if (schema instanceof z.ZodDefault) {
    return schema.def.defaultValue as z.infer<TSchema>
  }

  if (schema instanceof z.ZodPipe) {
    return createDefaultValues(schema.in as z.ZodTypeAny) as z.infer<TSchema>
  }

  if (schema instanceof z.ZodReadonly || schema instanceof z.ZodLazy) {
    return createDefaultValues(
      schema.unwrap() as z.ZodTypeAny
    ) as z.infer<TSchema>
  }

  if (schema instanceof z.ZodString) {
    return '' as z.infer<TSchema>
  }

  if (schema instanceof z.ZodNumber) {
    return 0 as z.infer<TSchema>
  }

  if (schema instanceof z.ZodBoolean) {
    return false as z.infer<TSchema>
  }

  if (schema instanceof z.ZodArray) {
    return [] as unknown as z.infer<TSchema>
  }

  if (schema instanceof z.ZodEnum) {
    return schema.options[0] as z.infer<TSchema>
  }

  if (schema instanceof z.ZodObject) {
    const shape = schema.shape

    const objDefaults: Record<string, unknown> = {}

    for (const key in shape) {
      objDefaults[key] = createDefaultValues(shape[key])
    }

    return objDefaults as z.infer<TSchema>
  }

  return undefined as z.infer<TSchema>
}
