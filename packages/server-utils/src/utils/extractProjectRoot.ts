import path from 'path'

/**
 * Gets the project root directory name from a file path.
 * Supports both app modules (/modules/) and core modules (/server/).
 */
export default function getProjectRootDir(
  filePath: string
): string | undefined {
  // For app modules: /path/to/projectRoot/modules/moduleId/server/...
  const appsIndex = filePath.indexOf('/modules/')

  if (appsIndex !== -1) {
    const pathBeforeApps = filePath.substring(0, appsIndex)

    return path.basename(pathBeforeApps)
  } else {
    // For core modules: /path/to/projectRoot/apps/api/src/...
    const serverIndex = filePath.indexOf('/apps/api/')

    if (serverIndex !== -1) {
      const pathBeforeServer = filePath.substring(0, serverIndex)

      return path.basename(pathBeforeServer)
    }
  }

  return undefined
}
