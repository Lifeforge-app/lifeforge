export type ModuleFiles = {
  packageJsonResolver: () => Promise<unknown>
  manifestResolver: () => Promise<unknown>
}

/**
 * Scans for package.json and manifest.ts files
 * in the module directory and also the internal apps directory
 *
 * @returns An object containing the package.json and manifest.ts files
 */
function scanModuleFiles() {
  const packageJsonFiles = import.meta.glob(
    ['../../../apps/*/package.json', '../../../../../apps/*/package.json'],
    { eager: false }
  )

  const manifestFiles = import.meta.glob(
    ['../../../apps/*/manifest.ts', '../../../../../apps/*/manifest.ts'],
    { eager: false }
  )

  return {
    packageJsonFiles,
    manifestFiles
  }
}

/**
 * Resolves the package.json and manifest.ts files
 * and stores them in the map grouped by module directory
 *
 * @param map The map to store the resolved files
 * @param type The type of file to resolve
 * @param files The files to resolve
 */
function resolveFiles(
  map: Map<string, Partial<ModuleFiles>>,
  type: 'packageJson' | 'manifest',
  files: Record<string, () => Promise<unknown>>
) {
  for (const [path, resolver] of Object.entries(files)) {
    const moduleDir = path.split('/').slice(0, -1).join('/')

    if (!map.has(moduleDir)) {
      map.set(moduleDir, {})
    }

    map.get(moduleDir)![`${type}Resolver`] = resolver as () => Promise<unknown>
  }
}

/**
 * Entry point for constructing the module map
 *
 * @returns The module map grouped by module directory, each containing the package.json and manifest.ts for that module
 */
export default function constructModuleMap() {
  const { packageJsonFiles, manifestFiles } = scanModuleFiles()

  const moduleMap = new Map<string, Partial<ModuleFiles>>()

  resolveFiles(moduleMap, 'packageJson', packageJsonFiles)
  resolveFiles(moduleMap, 'manifest', manifestFiles)

  return moduleMap
}
