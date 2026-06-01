import fs from 'fs'
import path from 'path'

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

export function serializeRoutes(node: any): any {
  if (node && typeof node === 'object') {
    if (
      node.__isForgeContract === true ||
      typeof node.getValue === 'function'
    ) {
      const val = node.getValue()

      return {
        method: val.method,
        description: val.description,
        noAuth: val.noAuth,
        encrypted: val.encrypted,
        isDownloadable: val.isDownloadable,
        media: val.media ?? null,
        input: {
          query:
            val.schema?.query &&
            typeof val.schema.query.toJSONSchema === 'function'
              ? fixJSONSchemaRecord(val.schema.query.toJSONSchema())
              : undefined,
          body:
            val.schema?.body &&
            typeof val.schema.body.toJSONSchema === 'function'
              ? fixJSONSchemaRecord(val.schema.body.toJSONSchema())
              : undefined
        },
        output:
          typeof val.output === 'string'
            ? val.output
            : val.output
              ? Object.fromEntries(
                  Object.entries(val.output).map(([k, v]) => [
                    k,
                    v === true
                      ? true
                      : v && typeof (v as any).toJSONSchema === 'function'
                        ? fixJSONSchemaRecord((v as any).toJSONSchema())
                        : v
                  ])
                )
              : undefined
      }
    }

    const result: any = {}

    for (const [key, value] of Object.entries(node)) {
      result[key] = serializeRoutes(value)
    }

    return result
  }

  return node
}

export function writeContractFileToClient(
  routes: any,
  serverRootDir: string,
  clientDir: string = '../client/src'
): void {
  const serialized = serializeRoutes(routes)

  const content = `export const contract = ${JSON.stringify(serialized, null, 2)} as const\n\nexport default contract\n`

  const clientSrcDir = path.resolve(serverRootDir, clientDir)

  if (!fs.existsSync(clientSrcDir)) {
    fs.mkdirSync(clientSrcDir, { recursive: true })
  }

  fs.writeFileSync(path.join(clientSrcDir, 'contract.ts'), content)
}
