import fs from 'fs'
import path from 'path'

import { PROJECT_ROOT } from '@/constants/constants'

type PackageType = 'module' | 'locale'

const TYPE_CONFIG = {
  module: {
    prefix: '@lifeforge/',
    dir: 'apps'
  },
  locale: {
    prefix: '@lifeforge/lang-',
    dir: 'locales'
  }
} as const

/**
 * Normalizes a package name and resolves its file system location.
 *
 * Takes a package name (with or without the `@lifeforge/` prefix) and returns
 * the fully qualified package name, short name, and absolute path to the package directory.
 *
 * @param packageName - The package name to normalize (e.g., "movies" or "@lifeforge/movies")
 * @param type - The type of package: 'module' (default) or 'locale'
 * @returns Object containing:
 *   - `fullName` - The fully qualified package name (e.g., "@lifeforge/movies")
 *   - `shortName` - The package name without the prefix (e.g., "movies")
 *   - `targetDir` - The absolute path to the package directory
 *
 * @example
 * // Module example
 * normalizePackage('movies')
 * // { fullName: '@lifeforge/movies', shortName: 'movies', targetDir: '/path/to/apps/movies' }
 *
 * @example
 * // Locale example
 * normalizePackage('zh-TW', 'locale')
 * // { fullName: '@lifeforge/lang-zh-TW', shortName: 'zh-TW', targetDir: '/path/to/locales/zh-TW' }
 */
export default function normalizePackage(
  packageName: string,
  type: PackageType = 'module'
) {
  const { prefix, dir } = TYPE_CONFIG[type]

  const fullName = packageName.startsWith(prefix)
    ? packageName
    : `${prefix}${packageName}`

  const shortName = fullName.replace(prefix, '')

  const targetDir = path.join(PROJECT_ROOT, dir, shortName)

  if (!fs.existsSync(path.dirname(targetDir))) {
    fs.mkdirSync(path.dirname(targetDir), { recursive: true })
  }

  return {
    fullName,
    shortName,
    targetDir
  }
}
