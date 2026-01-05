/**
 * Utility functions to create OpenAI response formats using Zod schemas.
 * This is a workaround until OpenAI provides Zod v4 support natively.
 */
import {
  makeParseableResponseFormat,
  makeParseableTextFormat
} from 'openai/lib/parser'
import type {
  AutoParseableResponseFormat,
  AutoParseableTextFormat
} from 'openai/lib/parser'
import type { ResponseFormatJSONSchema } from 'openai/resources'
import type { ResponseFormatTextJSONSchemaConfig } from 'openai/resources/responses/responses'
import z from 'zod'

/**
 * Creates an auto-parseable response format for OpenAI using a Zod schema.
 *
 * @param zodObject - The Zod schema defining the expected response structure
 * @param name - The name of the response format schema
 * @param props - Additional JSON schema properties
 * @returns An auto-parseable response format for use with OpenAI's API
 */
export function zodResponseFormat<ZodInput extends z.ZodType>(
  zodObject: ZodInput,
  name: string,
  props?: Omit<
    ResponseFormatJSONSchema.JSONSchema,
    'schema' | 'strict' | 'name'
  >
): AutoParseableResponseFormat<z.infer<ZodInput>> {
  return makeParseableResponseFormat(
    {
      type: 'json_schema',
      json_schema: {
        ...props,
        name,
        strict: true,
        schema: z.toJSONSchema(zodObject, { target: 'draft-7' })
      }
    },
    content => zodObject.parse(JSON.parse(content))
  )
}

/**
 * Creates an auto-parseable text format for OpenAI using a Zod schema.
 *
 * @param zodObject - The Zod schema defining the expected response structure
 * @param name - The name of the text format schema
 * @param props - Additional JSON schema properties
 * @returns An auto-parseable text format for use with OpenAI's API
 */
export function zodTextFormat<ZodInput extends z.ZodType>(
  zodObject: ZodInput,
  name: string,
  props?: Omit<
    ResponseFormatTextJSONSchemaConfig,
    'schema' | 'type' | 'strict' | 'name'
  >
): AutoParseableTextFormat<z.infer<ZodInput>> {
  return makeParseableTextFormat(
    {
      type: 'json_schema',
      ...props,
      name,
      strict: true,
      schema: z.toJSONSchema(zodObject, { target: 'draft-7' })
    },
    content => zodObject.parse(JSON.parse(content))
  )
}
