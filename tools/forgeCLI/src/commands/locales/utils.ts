import fs from 'fs'
import path from 'path'

const LOCALES_DIR = 'locales'

/**
 * Checks if a locale already exists in the locales directory
 */
export function localeExists(langName: string): boolean {
  return fs.existsSync(path.join(LOCALES_DIR, langName))
}

/**
 * Gets list of installed locales from locales directory
 */
export function getInstalledLocales(): string[] {
  if (!fs.existsSync(LOCALES_DIR)) {
    return []
  }

  return fs
    .readdirSync(LOCALES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !name.startsWith('.'))
}

/**
 * Validates language name format (lowercase, alphanumeric with hyphens)
 */
export function validateLocaleName(langName: string): boolean {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(langName)
}

export interface LocaleInstallConfig {
  langName: string
  localeDir: string
  repoUrl: string
  tempDir: string
}

/**
 * Creates locale installation configuration
 */
export function createLocaleConfig(langName: string): LocaleInstallConfig {
  return {
    langName,
    localeDir: path.join(LOCALES_DIR, langName),
    repoUrl: `https://github.com/lifeforge-app/lang-${langName}.git`,
    tempDir: '.temp'
  }
}
