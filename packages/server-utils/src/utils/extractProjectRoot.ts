import path from 'path'

/**
 * Gets the project root directory name from a file path.
 * Supports both app modules (/apps/) and core modules (/server/).
 */
export default function getProjectRootDir(
  filePath: string
): string | undefined {
  // For app modules: /path/to/projectRoot/apps/moduleId/server/...
  const appsIndex = filePath.indexOf('/apps/')

  if (appsIndex !== -1) {
    const pathBeforeApps = filePath.substring(0, appsIndex)

    return path.basename(pathBeforeApps)
  } else {
    // For core modules: /path/to/projectRoot/server/src/...
    const serverIndex = filePath.indexOf('/server/')

    if (serverIndex !== -1) {
      const pathBeforeServer = filePath.substring(0, serverIndex)

      return path.basename(pathBeforeServer)
    }
  }

  return undefined
}
