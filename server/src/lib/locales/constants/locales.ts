import fs from 'fs'
import path from 'path'

import { LoggingService } from '@functions/logging/loggingService'

export const ALLOWED_NAMESPACE = ['apps', 'common'] as const

const LANGUAGE_PACK_PATH = path.resolve(
  import.meta.dirname.split('/server')[0],
  'locales'
)

if (!fs.existsSync(LANGUAGE_PACK_PATH)) {
  LoggingService.error(
    'Language pack path does not exist. Please install at least one language pack through the Forge CLI.',
    'LOCALES'
  )

  process.exit(1)
}

const languagePacks = fs.readdirSync(LANGUAGE_PACK_PATH)

if (!languagePacks.length) {
  LoggingService.error(
    'Language pack path is empty. Please install at least one language pack through the Forge CLI.',
    'LOCALES'
  )

  process.exit(1)
}

const isAllFolder = languagePacks.every(e =>
  fs.lstatSync(path.join(LANGUAGE_PACK_PATH, e)).isDirectory()
)

if (!isAllFolder) {
  LoggingService.error(
    'Language pack path contains non-folder files. Please check the language pack path.',
    'LOCALES'
  )

  process.exit(1)
}

export const LANG_MANIFESTS = languagePacks.map(e => {
  const manifestPath = path.join(LANGUAGE_PACK_PATH, e, 'manifest.json')

  if (!fs.existsSync(manifestPath)) {
    LoggingService.error(
      `Language pack ${e} does not have a manifest file. Please check the language pack path.`,
      'LOCALES'
    )

    process.exit(1)
  }

  const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))

  if (['name', 'icon', 'displayName'].some(e => !content[e])) {
    LoggingService.error(
      `Language pack ${e} does not have a name, icon, or displayName. Please check the language pack path.`,
      'LOCALES'
    )

    process.exit(1)
  }

  return content
})

export const SYSTEM_LOCALES = Object.fromEntries(
  languagePacks.map(lang => {
    try {
      const languagePackContent = fs
        .readdirSync(path.join(LANGUAGE_PACK_PATH, lang))
        .filter(e => e !== '.git')

      for (const item of languagePackContent) {
        const itemPath = path.join(LANGUAGE_PACK_PATH, lang, item)

        if (!fs.lstatSync(itemPath).isFile() || !item.endsWith('.json')) {
          LoggingService.error(
            `Language pack ${lang} contains non-json files. Please check the language pack path.`,
            'LOCALES'
          )

          process.exit(1)
        }
      }

      return [
        lang,
        Object.fromEntries(
          languagePackContent
            .filter(file => file !== 'manifest.json')
            .map(file => [
              file.replace('.json', ''),
              JSON.parse(
                fs.readFileSync(
                  path.join(LANGUAGE_PACK_PATH, lang, file),
                  'utf-8'
                )
              )
            ])
        )
      ]
    } catch (e) {
      LoggingService.error(
        `Language pack ${lang} failed to load. Please check the language pack path. Error: ${e}`,
        'LOCALES'
      )

      process.exit(1)
    }
  })
)

export const ALLOWED_LANG = LANG_MANIFESTS.map(e => [
  e.name,
  ...(e.alternative || [])
])

const duplicatedLang = ALLOWED_LANG.flat().filter(
  (e, i) => ALLOWED_LANG.flat().indexOf(e) !== i
)

if (duplicatedLang.length) {
  LoggingService.error(
    `Language ${duplicatedLang.join(', ')} is duplicated. Please check the language pack path.`,
    'LOCALES'
  )

  process.exit(1)
}
