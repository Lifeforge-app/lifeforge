import fs from 'node:fs'
import path from 'node:path'

/**
 * Custom resolver for Vite to resolve '@/' imports within a monorepo setup.
 * Supports resolving from the client src directory, client root for manifest files,
 * and falls back to package src directories.
 */
export function customResolver(id: string, importer: string | undefined): string | null {
  if (!importer) {
    return null
  }

  let rootDir: string
  const clientMatch = importer.match(/(.+\/client)/)
  if (clientMatch) {
    const clientDir = clientMatch[1]
    rootDir =
      id === '@/manifest' || id === '@/manifest.ts'
        ? clientDir
        : `${clientDir}/src`
  } else {
    const srcMatch = importer.match(/(.+\/src)/)
    if (!srcMatch) {
      return null
    }
    rootDir = srcMatch[1]
  }

  const basePath = path.resolve(rootDir, id.slice(2))
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

  console.log(
    `[vite] failed to resolve import "${id}" from "${importer}"`
  )
  return null
}
