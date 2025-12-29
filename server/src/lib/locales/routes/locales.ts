import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import { LoggingService } from '@functions/logging/loggingService'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

import {
  ALLOWED_LANG,
  ALLOWED_NAMESPACE,
  LANG_MANIFESTS,
  SYSTEM_LOCALES
} from '../constants/locales'

export const allApps = fs
  .globSync([
    '../tools/**/locales',
    path.resolve(import.meta.dirname.split('/server')[0], 'apps/**/locales')
  ])
  .filter(dir => {
    return fs.existsSync(path.join(dir, 'en.json'))
  })
  .map(dir => path.dirname(dir))

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
    return LANG_MANIFESTS as unknown as {
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
      lang: z.enum(ALLOWED_LANG.flat()),
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    })
  })
  .callback(async ({ query: { lang, namespace, subnamespace } }) => {
    const finalLang = ALLOWED_LANG.find(e => e.includes(lang))?.[0]

    if (!finalLang) {
      throw new ClientError(`Language ${lang} does not exist`, 404)
    }

    let data

    if (namespace === 'apps') {
      const target = allApps.find(e => e.split('/').pop() === subnamespace)

      if (!target) {
        return {}
      }

      if (!fs.existsSync(`${target}/locales/${finalLang}.json`)) {
        throw new ClientError(
          `Locale ${finalLang} is not supported for app ${subnamespace}`,
          404
        )
      }

      data = JSON.parse(
        fs.readFileSync(`${target}/locales/${finalLang}.json`, 'utf-8')
      )
    } else {
      if (!SYSTEM_LOCALES[finalLang][subnamespace]) {
        return {}
      }

      data = SYSTEM_LOCALES[finalLang][subnamespace]
    }

    if (namespace === 'common' && subnamespace === 'sidebar') {
      data.apps = {
        ...Object.fromEntries(
          allApps
            .map(module => {
              if (!fs.existsSync(`${module}/locales/${finalLang}.json`)) {
                return []
              }

              const data = JSON.parse(
                fs.readFileSync(`${module}/locales/${finalLang}.json`, 'utf-8')
              )

              return [
                module.split('/').pop() || '',
                {
                  title: data.title ?? '',
                  subsections: data.subsections ?? {}
                }
              ]
            })
            .filter(e => e.length > 0)
        ),
        ...Object.fromEntries(
          Object.entries(SYSTEM_LOCALES[finalLang])
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
