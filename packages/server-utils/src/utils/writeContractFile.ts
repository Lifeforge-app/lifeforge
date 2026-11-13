/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import { compile } from 'json-schema-to-typescript'
import path from 'path'

import { isSuccessOutputKey } from '../response'

/**
 * Params for `toJSONSchema` that let DTOs use `z.date()` on the server while
 * still emitting a `date-time` string schema for the client. Dates are
 * unrepresentable in JSON Schema (zod throws), so we fall back to `any` and
 * rewrite date nodes ourselves.
 */
const jsonSchemaParams = {
  unrepresentable: 'any' as const,
  override: (ctx: { zodSchema: any; jsonSchema: any }) => {
    if (ctx.zodSchema?._zod?.def?.type === 'date') {
      ctx.jsonSchema.type = 'string'
      ctx.jsonSchema.format = 'date-time'
    }
  }
}

function fixJSONSchemaRecord(schema: any): any {
  if (!schema || typeof schema !== 'object') {
    return schema
  }

  if (Array.isArray(schema)) {
    return schema.map(fixJSONSchemaRecord)
  }

  const result = { ...schema }

  for (const key of Object.keys(result)) {
    result[key] = fixJSONSchemaRecord(result[key])
  }

  if (
    result.type === 'object' &&
    result.propertyNames &&
    result.propertyNames.enum &&
    Array.isArray(result.propertyNames.enum) &&
    result.additionalProperties &&
    typeof result.additionalProperties === 'object'
  ) {
    result.properties = result.properties ?? {}

    for (const key of result.propertyNames.enum) {
      result.properties[key] = result.additionalProperties
    }
    result.additionalProperties = false
  }

  if (
    result.type === 'object' &&
    result.propertyNames &&
    !result.propertyNames.enum
  ) {
    delete result.propertyNames
  }

  return result
}

export function serializeEndpointValue(val: any): {
  method: any
  description: any
  noAuth: any
  encrypted: any
  isDownloadable: any
  media: any
  input: {
    query: any
    body: any
  }
  output: any
} {
  return {
    method: val.method,
    description: val.description,
    noAuth: val.noAuth,
    encrypted: val.encrypted,
    isDownloadable: val.isDownloadable,
    media: val.media ?? null,
    input: {
      query:
        val.schema?.query && typeof val.schema.query.toJSONSchema === 'function'
          ? fixJSONSchemaRecord(val.schema.query.toJSONSchema(jsonSchemaParams))
          : undefined,
      body:
        val.schema?.body && typeof val.schema.body.toJSONSchema === 'function'
          ? fixJSONSchemaRecord(val.schema.body.toJSONSchema(jsonSchemaParams))
          : undefined
    },
    output:
      typeof val.output === 'string'
        ? val.output
        : val.output
          ? Object.fromEntries(
              Object.entries(val.output)
                .filter(([k]) => isSuccessOutputKey(k))
                .map(([k, v]) => [
                  k,
                  v === true
                    ? true
                    : v && typeof (v as any).toJSONSchema === 'function'
                      ? fixJSONSchemaRecord(
                          (v as any).toJSONSchema(jsonSchemaParams)
                        )
                      : v
                ])
            )
          : undefined
  }
}

export function serializeRoutes(node: any): any {
  if (node && typeof node === 'object') {
    if (
      node.__isForgeContract === true ||
      typeof node.getValue === 'function'
    ) {
      return serializeEndpointValue(node.getValue())
    }

    const result: any = {}

    for (const [key, value] of Object.entries(node)) {
      const serialized = serializeRoutes(value)

      if (
        serialized !== null &&
        typeof serialized === 'object' &&
        !Array.isArray(serialized)
      ) {
        result[key] = serialized
      }
    }

    return result
  }

  return node
}

// ============================================
// TypeScript declaration emission
// ============================================

interface DefinitionMap {
  [key: string]: unknown
}

function sanitizeSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9]/g, '_')
}

function uniqueKey(definitions: DefinitionMap, base: string): string {
  let key = base
  let index = 1

  while (key in definitions) {
    key = `${base}_${index++}`
  }

  return key
}

function reference(key: string): { $ref: string } {
  return { $ref: `#/definitions/${key}` }
}

function buildEndpointDefinition(
  endpoint: any,
  base: string,
  definitions: DefinitionMap
): Record<string, unknown> {
  const inputProperties: Record<string, unknown> = {}

  for (const part of ['query', 'body'] as const) {
    const schema = endpoint.input?.[part]

    if (!schema) continue

    const key = uniqueKey(
      definitions,
      `${base}_Input${part === 'query' ? 'Query' : 'Body'}`
    )

    definitions[key] = schema
    inputProperties[part] = reference(key)
  }

  let output: unknown = { tsType: 'any' }

  if (endpoint.output && endpoint.output !== 'custom') {
    const variants = Object.entries(
      endpoint.output as Record<string, unknown>
    ).map(([status, schema]) => {
      const key = uniqueKey(definitions, `${base}_Output${status}`)

      definitions[key] = schema === true ? { tsType: 'void' } : schema

      return {
        type: 'object',
        properties: { [status]: reference(key) },
        required: [status],
        additionalProperties: false
      }
    })

    output = variants.length > 0 ? { anyOf: variants } : { tsType: 'any' }
  }

  return {
    type: 'object',
    properties: {
      method: { const: endpoint.method },
      input: {
        type: 'object',
        properties: inputProperties,
        additionalProperties: false
      },
      output,
      media: { const: endpoint.media ?? null }
    },
    required: ['method', 'input', 'output', 'media'],
    additionalProperties: false
  }
}

/**
 * Builds a single composed JSON Schema for the whole route tree. Every endpoint
 * and every input/output schema becomes a `definition`, referenced with `$ref`,
 * so `json-schema-to-typescript` owns naming, reference resolution and emission.
 */
function buildContractSchema(
  node: any,
  pathSegments: string[],
  definitions: DefinitionMap
): Record<string, unknown> {
  if (node && typeof node === 'object' && 'method' in node) {
    const raw = pathSegments.map(sanitizeSegment).filter(Boolean).join('_')

    const key = uniqueKey(definitions, `Endpoint_${raw || 'root'}`)

    definitions[key] = buildEndpointDefinition(node, key, definitions)

    return reference(key)
  }

  const properties: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(node as Record<string, any>)) {
    properties[key] = buildContractSchema(
      value,
      [...pathSegments, key],
      definitions
    )
  }

  return {
    type: 'object',
    properties,
    required: Object.keys(properties),
    additionalProperties: false
  }
}

export async function buildContractDeclaration(
  serialized: Record<string, unknown>
): Promise<string> {
  const definitions: DefinitionMap = {}

  const root = buildContractSchema(serialized, [], definitions)

  const source = await compile({ ...root, definitions } as any, 'Contract', {
    bannerComment: ''
  })

  return `${source.trim()}
`
}

export async function writeContractFileToClient(
  routes: any,
  serverRootDir: string,
  clientDir: string = '../client'
): Promise<void> {
  if (process.env.NODE_ENV === 'production') return

  try {
    const serialized = serializeRoutes(routes)

    const content = await buildContractDeclaration(serialized)

    const clientSrcDir = path.resolve(serverRootDir, clientDir)

    if (!fs.existsSync(clientSrcDir)) {
      fs.mkdirSync(clientSrcDir, { recursive: true })
    }

    fs.writeFileSync(path.join(clientSrcDir, 'contract.ts'), content)
  } catch (error) {
    console.error('Failed to generate contract declaration:', error)
  }
}
