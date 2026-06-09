import getProjectRootDir from './extractProjectRoot'

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

  const projectRoot = getProjectRootDir(filePath)

  if (!projectRoot) return undefined

  // Try external app module: /{projectRoot}/modules/{moduleId}/server/
  const appMatch = filePath.match(
    new RegExp(`${projectRoot}\\/modules\\/([^/]+)\\/server\\/`)
  )

  if (appMatch)
    return {
      source: 'app',
      id: appMatch[1]
    }

  // Try core module:
  // - /{projectRoot}/apps/api/src/lib/{coreModuleId}/
  // - /{projectRoot}/apps/api/src/core/{coreModuleId}/
  const coreMatch = filePath.match(
    new RegExp(`${projectRoot}\\/apps\\/api\\/src\\/(?:lib|core)\\/([^/]+)\\/`)
  )

  if (coreMatch)
    return {
      source: 'core',
      id: coreMatch[1]
    }

  return undefined
}
