import path from 'path'

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

  // Extract project root from file path
  let projectRoot: string | undefined

  // For app modules: /path/to/projectRoot/apps/moduleId/server/...
  const appsIndex = filePath.indexOf('/apps/')

  if (appsIndex !== -1) {
    const pathBeforeApps = filePath.substring(0, appsIndex)

    projectRoot = path.basename(pathBeforeApps)
  } else {
    // For core modules: /path/to/projectRoot/server/src/...
    const serverIndex = filePath.indexOf('/server/')

    if (serverIndex !== -1) {
      const pathBeforeServer = filePath.substring(0, serverIndex)
	  
      projectRoot = path.basename(pathBeforeServer)
    }
  }

  if (!projectRoot) return undefined

  // Try external app module: /{projectRoot}/apps/{moduleId}/server/
  const appMatch = filePath.match(
    new RegExp(`${projectRoot}\\/apps\\/([^/]+)\\/server\\/`)
  )

  if (appMatch)
    return {
      source: 'app',
      id: appMatch[1]
    }

  // Try core module:
  // - /{projectRoot}/server/src/lib/{coreModuleId}/
  // - /{projectRoot}/server/src/core/{coreModuleId}/
  const coreMatch = filePath.match(
    new RegExp(`${projectRoot}\\/server\\/src\\/(?:lib|core)\\/([^/]+)\\/`)
  )

  if (coreMatch)
    return {
      source: 'core',
      id: coreMatch[1]
    }

  return undefined
}
