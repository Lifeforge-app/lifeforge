export default function getCallerModuleId():
  | { source: 'app' | 'core'; id: string }
  | undefined {
  const obj: { stack?: string } = {}

  Error.captureStackTrace(obj)

  const lines = obj.stack?.split('\n') || []

  const callerLine = lines[3]

  const pathMatch =
    callerLine?.match(/\((.+):\d+:\d+\)/) ||
    callerLine?.match(/at (.+):\d+:\d+/)

  const filePath = pathMatch?.[1]

  if (!filePath) return undefined

  // Try external app module: /apps/{moduleId}/server/
  const appMatch = filePath.match(/lifeforge\/apps\/([^/]+)\/server\//)

  if (appMatch)
    return {
      source: 'app',
      id: appMatch[1]
    }

  // Try core module:
  // - /lifeforge/server/src/lib/{coreModuleId}/
  // - /lifeforge/server/src/core/{coreModuleId}/
  const coreMatch = filePath.match(
    /lifeforge\/server\/src\/(?:lib|core)\/([^/]+)\//
  )

  if (coreMatch)
    return {
      source: 'core',
      id: coreMatch[1]
    }

  return undefined
}
