import { LoggingService } from '@functions/logging/loggingService'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import { ALLOWED_LANG, ALLOWED_NAMESPACE } from '../constants/locales'

export const allApps = fs
  .globSync([
    '../client/src/apps/**/locales',
    '../tools/**/locales',
    path.resolve(process.cwd(), '../apps/**/locales')
  ])
  .filter(dir => {
    return fs.existsSync(path.join(dir, 'en.json'))
  })
  .map(dir => path.dirname(dir))

const getLocale = forgeController
  .query()
  .noAuth()
  .description(
    'Get locales for a specific language, namespace, and subnamespace'
  )
  .input({
    query: z.object({
      lang: z.enum(ALLOWED_LANG),
      namespace: z.enum(ALLOWED_NAMESPACE),
      subnamespace: z.string()
    })
  })
  .callback(async ({ query: { lang, namespace, subnamespace } }) => {
    const finalLang = lang === 'zh' ? 'zh-CN' : lang

    let data

    if (namespace === 'apps') {
      const target = allApps.find(e => e.split('/').pop() === subnamespace)

      if (!target) {
        throw new ClientError(
          `Subnamespace ${subnamespace} does not exist in apps`,
          404
        )
      }

      data = JSON.parse(
        fs.readFileSync(`${target}/locales/${finalLang}.json`, 'utf-8')
      )
    } else {
      if (
        !fs.existsSync(
          `${process.cwd()}/src/core/locales/${finalLang}/${subnamespace}.json`
        )
      ) {
        throw new ClientError(
          `Subnamespace ${subnamespace} does not exist in namespace ${namespace}`,
          404
        )
      }

      data = JSON.parse(
        fs.readFileSync(
          `${process.cwd()}/src/core/locales/${finalLang}/${subnamespace}.json`,
          'utf-8'
        )
      )
    }

    if (namespace === 'common' && subnamespace === 'sidebar') {
      data.apps = Object.fromEntries(
        allApps.map(module => {
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
      )
    }

    return data
  })

const notifyMissing = forgeController
  .mutation()
  .description('Notify server about missing locale')
  .input({
    body: z.object({
      namespace: z.string(),
      key: z.string()
    })
  })
  .callback(async ({ body: { namespace, key } }) => {
    LoggingService.warn(`Missing locale ${chalk.red(`${namespace}:${key}`)}`)
  })

export default forgeRouter({
  getLocale,
  notifyMissing
})
