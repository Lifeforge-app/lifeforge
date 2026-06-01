import fs from 'fs'
import path from 'path'

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
              ? val.schema.query.toJSONSchema()
              : undefined,
          body:
            val.schema?.body &&
            typeof val.schema.body.toJSONSchema === 'function'
              ? val.schema.body.toJSONSchema()
              : undefined
        },
        output: typeof val.output === 'string'
          ? val.output
          : val.output
            ? Object.fromEntries(
                Object.entries(val.output).map(([k, v]) => [
                  k,
                  v === true
                    ? true
                    : v && typeof (v as any).toJSONSchema === 'function'
                      ? (v as any).toJSONSchema()
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
