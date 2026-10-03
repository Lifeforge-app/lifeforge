/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import path from 'path'

import { isSuccessOutputKey } from '../response'

function cleanAdditionalProperties(schema: any): any {
  if (!schema || typeof schema !== 'object') {
    return schema
  }

  if (Array.isArray(schema)) {
    return schema.map(cleanAdditionalProperties)
  }

  const result = { ...schema }

  if ('additionalProperties' in result) {
    delete result.additionalProperties
  }

  for (const key of Object.keys(result)) {
    result[key] = cleanAdditionalProperties(result[key])
  }

  return result
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

  if (result.allOf && Array.isArray(result.allOf)) {
    result.allOf = result.allOf.map((sub: any) => {
      if (sub && typeof sub === 'object') {
        const cleanedSub = { ...sub }

        if ('additionalProperties' in cleanedSub) {
          delete cleanedSub.additionalProperties
        }

        return cleanAdditionalProperties(cleanedSub)
      }

      return sub
    })
  }

  return result
}

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

export function writeContractFileToClient(
  routes: any,
  serverRootDir: string,
  clientDir: string = '../client'
): void {
  if (process.env.NODE_ENV === 'production') return

  const serialized = serializeRoutes(routes)

  const content = `export const contract = ${JSON.stringify(serialized, null, 2)} as const\n\nexport default contract\n`

  const clientSrcDir = path.resolve(serverRootDir, clientDir)

  if (!fs.existsSync(clientSrcDir)) {
    fs.mkdirSync(clientSrcDir, { recursive: true })
  }

  fs.writeFileSync(path.join(clientSrcDir, 'contract.ts'), content)
}
