import path from 'path'

import { LOCALES_DIR } from '../constants'

function extractLocaleName(packageName: string): string {
  return packageName.replace('@lifeforge/lang-', '')
}

export function normalizeLocalePackageName(langCode: string): string {
  return langCode.startsWith('@lifeforge/lang-')
    ? langCode
    : `@lifeforge/lang-${langCode}`
}

function getLocalePath(langCode: string): string {
  const shortName = extractLocaleName(langCode)

  return path.join(LOCALES_DIR, shortName)
}

function getLocalesMeta(langCode: string) {
  const fullPackageName = normalizeLocalePackageName(langCode)

  const shortName = extractLocaleName(fullPackageName)

  const targetDir = getLocalePath(shortName)

  return {
    fullPackageName,
    shortName,
    targetDir
  }
}

export default getLocalesMeta
