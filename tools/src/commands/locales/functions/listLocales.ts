import fs from 'fs'
import path from 'path'

import { LOCALES_DIR } from '@/constants/constants'

export function listLocales(): string[] {
  return fs.readdirSync(LOCALES_DIR).filter(dir => {
    if (dir.startsWith('.')) return false

    const fullPath = path.join(LOCALES_DIR, dir)

    const packageJsonPath = path.join(fullPath, 'package.json')

    return fs.statSync(fullPath).isDirectory() && fs.existsSync(packageJsonPath)
  })
}

export function listLocalesWithMeta(): {
  name: string
  displayName: string
  version: string
}[] {
  const locales = listLocales()

  const installedLocales: {
    name: string
    displayName: string
    version: string
  }[] = []

  locales.forEach(locale => {
    const packageJsonPath = path.join(LOCALES_DIR, locale, 'package.json')

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

    installedLocales.push({
      name: locale,
      displayName: packageJson.lifeforge?.displayName || locale,
      version: packageJson.version
    })
  })

  return installedLocales
}
