import fs from 'fs'
import path from 'path'

import { LOCALES_DIR } from '@/utils/constants'

export interface LocaleInfo {
  id: string
  name: string
  dir: string
  code: string
  displayName: string
  version: string
}

/** Scans `locales/` and reads each language pack's package.json. */
function scanLocales(): LocaleInfo[] {
  if (!fs.existsSync(LOCALES_DIR)) {
    return []
  }

  const locales: LocaleInfo[] = []

  for (const dirent of fs.readdirSync(LOCALES_DIR, { withFileTypes: true })) {
    if (!dirent.isDirectory() || dirent.name.startsWith('.')) {
      continue
    }

    const dir = path.join(LOCALES_DIR, dirent.name)

    const packageJsonPath = path.join(dir, 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
      continue
    }

    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf-8')
    ) as {
      name: string
      version: string
      lifeforge?: {
        code?: string
        displayName?: string
      }
    }

    locales.push({
      id: packageJson.name.replace(/^@lifeforge\//, ''),
      name: packageJson.name,
      dir,
      code: packageJson.lifeforge?.code ?? dirent.name,
      displayName: packageJson.lifeforge?.displayName ?? dirent.name,
      version: packageJson.version
    })
  }

  return locales
}

export function listLocales(): LocaleInfo[] {
  return scanLocales()
}

export function listLocalesWithMeta(): LocaleInfo[] {
  return scanLocales()
}

/** Resolves an installed language pack by its package id. */
export function resolveLocale(id: string): LocaleInfo | undefined {
  return scanLocales().find(locale => locale.id === id)
}
