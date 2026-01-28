import { ROOT_DIR } from '@constants'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import { createServiceLogger } from '@functions/logging'

const localeLogger = createServiceLogger('Locale')

export const ALLOWED_NAMESPACE = ['apps', 'common'] as const

export const LANGUAGE_PACK_PATH = path.resolve(ROOT_DIR, 'locales')

interface LangManifest {
  packName: string
  name: string
  icon: string
  displayName: string
  alternative?: string[]
}

export interface LocaleData {
  title?: string
  subsections?: Record<string, unknown>
  [key: string]: unknown
}

const localesPackageJSONSchema = z.object({
  name: z.string().regex(/^@lifeforge\/.+--lang-.+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string(),
  author: z.string(),
  repository: z
    .object({
      type: z.literal('git'),
      url: z.string()
    })
    .optional(),
  lifeforge: z.object({
    code: z.string(),
    displayName: z.string(),
    icon: z.string(),
    alternative: z.array(z.string()).optional()
  })
})

export class LocaleService {
  private static languagePacks: string[] = []
  private static langManifests: LangManifest[] = []
  private static systemLocales: Record<string, Record<string, LocaleData>> = {}
  private static allowedLang: string[][] = []

  static getLanguagePacks(): string[] {
    return this.languagePacks
  }

  static getLangManifests(): LangManifest[] {
    return this.langManifests
  }

  static getSystemLocales(): Record<string, Record<string, LocaleData>> {
    return this.systemLocales
  }

  static getAllowedLang(): string[][] {
    return this.allowedLang
  }

  /**
   * Validates and loads language packs. Should be called after submodule update.
   */
  static validateAndLoad(): void {
    if (!fs.existsSync(LANGUAGE_PACK_PATH)) {
      localeLogger.error(
        'Language pack path does not exist. Please install at least one language pack through the Forge CLI.'
      )

      process.exit(1)
    }

    this.languagePacks = fs
      .readdirSync(LANGUAGE_PACK_PATH)
      .filter(e => !['.gitkeep', 'package.json'].includes(e))

    if (!this.languagePacks.length) {
      localeLogger.error(
        'Language pack path is empty. Please install at least one language pack through the Forge CLI.'
      )

      process.exit(1)
    }

    const isAllFolder = this.languagePacks.every(e =>
      fs.lstatSync(path.join(LANGUAGE_PACK_PATH, e)).isDirectory()
    )

    if (!isAllFolder) {
      localeLogger.error(
        'Language pack path contains non-folder files. Please check the language pack path.'
      )

      process.exit(1)
    }

    this.langManifests = this.languagePacks.map(e => {
      const packagePath = path.join(LANGUAGE_PACK_PATH, e, 'package.json')

      if (!fs.existsSync(packagePath)) {
        localeLogger.error(
          `Language pack ${e} does not have a package.json file. Please check the language pack path.`
        )

        process.exit(1)
      }

      const content = localesPackageJSONSchema.safeParse(
        JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
      )

      if (!content.success) {
        localeLogger.error(
          `Language pack ${e} does not have a valid package.json. Please check the language pack path:\n${content.error.issues.map(e => ` - ${e.path.join('.')}: ${e.message}`).join('\n')}`
        )

        process.exit(1)
      }

      return {
        packName: e,
        name: content.data.lifeforge.code,
        icon: content.data.lifeforge.icon,
        displayName: content.data.lifeforge.displayName,
        alternative: content.data.lifeforge.alternative
      }
    })

    this.systemLocales = Object.fromEntries(
      this.languagePacks.map(lang => {
        try {
          const languagePackContent = fs
            .readdirSync(path.join(LANGUAGE_PACK_PATH, lang))
            .filter(e => e !== '.git' && e !== 'package.json')

          for (const item of languagePackContent) {
            const itemPath = path.join(LANGUAGE_PACK_PATH, lang, item)

            if (!fs.lstatSync(itemPath).isFile() || !item.endsWith('.json')) {
              localeLogger.error(
                `Language pack ${lang} contains non-json files. Please check the language pack path.`
              )

              process.exit(1)
            }
          }

          return [
            this.langManifests.find(e => e.packName === lang)?.name,
            Object.fromEntries(
              languagePackContent.map(file => [
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
          localeLogger.error(
            `Language pack ${lang} failed to load. Please check the language pack path. Error: ${e}`
          )

          process.exit(1)
        }
      })
    )

    this.allowedLang = this.langManifests.map(e => [
      e.name,
      ...(e.alternative || [])
    ])

    const duplicatedLang = this.allowedLang
      .flat()
      .filter((e, i) => this.allowedLang.flat().indexOf(e) !== i)

    if (duplicatedLang.length) {
      localeLogger.error(
        `Language ${duplicatedLang.join(', ')} is duplicated. Please check the language pack path.`
      )

      process.exit(1)
    }

    localeLogger.info(
      `Loaded ${chalk.green(this.languagePacks.length)} language pack(s): ${chalk.dim(this.languagePacks.join(', '))}`
    )
  }
}
