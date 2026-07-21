import fs from 'node:fs'
import path from 'node:path'

/**
 * Custom resolver for Vite to resolve '@/' imports within a monorepo setup.
 * Supports resolving from the client src directory, client root for manifest files,
 * and falls back to package src directories.
 */
export function clientAliasResolver(
  id: string,
  importer: string | undefined
): string | null {
  if (!importer) {
    return null
  }

  let normalizedImporter = importer

  if (!path.isAbsolute(normalizedImporter)) {
    normalizedImporter = path.resolve(process.cwd(), normalizedImporter)
  }
  normalizedImporter = normalizedImporter.replace(/^\/@fs\/?/, '')

  if (!normalizedImporter.startsWith('/')) {
    normalizedImporter = '/' + normalizedImporter
  }

  let rootDir: string

  const clientMatch = normalizedImporter.match(/(.+\/(?:client|web))/)

  if (clientMatch) {
    const clientDir = clientMatch[1]

    rootDir =
      id === '@/manifest' || id === '@/manifest.ts'
        ? clientDir
        : `${clientDir}/src`
  } else {
    const srcMatch = normalizedImporter.match(/(.+\/src)/)

    if (!srcMatch) {
      return null
    }
    rootDir = srcMatch[1]
  }

  const subPath = id === '@' ? '' : id.slice(2)
  const basePath = path.resolve(rootDir, subPath)

  const candidates = [
    `${basePath}.tsx`,
    `${basePath}.ts`,
    `${basePath}.json`,
    path.resolve(basePath, 'index.tsx'),
    path.resolve(basePath, 'index.ts'),
    basePath
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  console.error(`[vite] failed to resolve import "${id}" from "${importer}"`)

  return null
}
