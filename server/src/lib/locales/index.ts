import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import normalizeSubnamespace from 'shared/src/utils/normalizeSubnamespace'

import {
  ALLOWED_NAMESPACE,
  LocaleService
} from '@functions/initialization/localeService'
import { LoggingService } from '@functions/logging/loggingService'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

// Get the project root directory
const projectRoot = import.meta.dirname.split('/server')[0]

// Scan apps directory for modules with locales
const appsDir = path.join(projectRoot, 'apps')

function getModulesWithLocales(): string[] {
  if (!fs.existsSync(appsDir)) return []

  return fs
    .readdirSync(appsDir)
    .filter(dir => {
      if (dir.startsWith('.')) return false

      const localesPath = path.join(appsDir, dir, 'locales')

      return fs.existsSync(localesPath)
    })
    .map(dir => path.join(appsDir, dir))
}

const moduleApps = getModulesWithLocales()

const listLanguages = forgeController
  .query()
  .noAuth()
  .noEncryption()
  .description({
    en: 'List all languages',
    ms: 'Senarai semua bahasa',
    'zh-CN': '列出所有语言',
    'zh-TW': '列出所有語言'
  })
  .input({})
  .callback(async () => {
    return LocaleService.getLangManifests() as unknown as {
      name: string
      alternative?: string[]
      icon: string
      displayName: string
    }[]
  })

const getLocale = forgeController
  .query()
  .noAuth()
  .description({
    en: 'Retrieve localization strings for namespace',
    ms: 'Dapatkan rentetan penyetempatan untuk ruang nama',
    'zh-CN': '获取命名空间的本地化字符串',
    'zh-TW': '獲取命名空間的本地化字串'
  })
  .input({
    query: z.object({
      lang: z.string(),
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    })
  })
  .callback(async ({ query: { lang, namespace, subnamespace } }) => {
    subnamespace = normalizeSubnamespace(subnamespace)

    const finalLang = LocaleService.getAllowedLang().find(e =>
      e.includes(lang)
    )?.[0]

    if (!finalLang) {
      throw new ClientError(`Language ${lang} does not exist`, 404)
    }

    let data

    if (namespace === 'apps') {
      // Find module by extracting name from path (e.g., lifeforge--calendar -> calendar)
      const target = moduleApps.find(
        modulePath =>
          normalizeSubnamespace(path.basename(modulePath)) === subnamespace
      )

      if (!target) {
        return {}
      }

      const localePath = path.join(target, 'locales', `${finalLang}.json`)

      if (!fs.existsSync(localePath)) {
        return {}
      }

      data = JSON.parse(fs.readFileSync(localePath, 'utf-8'))
    } else {
      if (!LocaleService.getSystemLocales()[finalLang][subnamespace]) {
        return {}
      }

      data = LocaleService.getSystemLocales()[finalLang][subnamespace]
    }

    if (namespace === 'common' && subnamespace === 'sidebar') {
      data.apps = {
        ...Object.fromEntries(
          moduleApps
            .map(modulePath => {
              const localePath = path.join(
                modulePath,
                'locales',
                `${finalLang}.json`
              )

              if (!fs.existsSync(localePath)) {
                return []
              }

              const localeData = JSON.parse(
                fs.readFileSync(localePath, 'utf-8')
              )

              const moduleName = normalizeSubnamespace(
                path.basename(modulePath)
              )

              return [
                moduleName,
                {
                  title: localeData.title ?? '',
                  subsections: localeData.subsections ?? {}
                }
              ]
            })
            .filter(e => e.length > 0)
        ),
        ...Object.fromEntries(
          Object.entries(LocaleService.getSystemLocales()[finalLang])
            .filter(e => 'title' in e[1])
            .map(e => [
              e[0],
              { title: e[1].title, subsections: e[1].subsections || {} }
            ])
        )
      }
    }

    return data
  })

const notifyMissing = forgeController
  .mutation()
  .description({
    en: 'Report missing localization key',
    ms: 'Laporkan kunci penyetempatan yang hilang',
    'zh-CN': '报告缺失的本地化键',
    'zh-TW': '報告缺失的本地化鍵'
  })
  .input({
    body: z.object({
      namespace: z.string(),
      key: z.string()
    })
  })
  .callback(async ({ body: { namespace, key } }) => {
    LoggingService.warn(
      `Missing locale ${chalk.red(`${namespace}:${key}`)}`,
      'LOCALES'
    )
  })

export default forgeRouter({
  listLanguages,
  getLocale,
  notifyMissing
})
