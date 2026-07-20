import { ROOT_DIR } from '@constants'
import {
  ALLOWED_NAMESPACE,
  LocaleService
} from '@functions/initialization/localeService'
import { ModuleRegistry } from '@functions/modules/moduleRegistry'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import { createForge, forgeRouter } from '@lifeforge/server-utils'

const forge = createForge({}, 'locales')

const appsDir = path.join(ROOT_DIR, 'modules')

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

const listLanguages = forge
  .query({
    description: 'List all languages',
    noAuth: true,
    encrypted: false,
    input: {},
    output: {
      OK: z.array(
        z.object({
          name: z.string(),
          alternative: z.array(z.string()).optional(),
          icon: z.string(),
          displayName: z.string()
        })
      )
    }
  })
  .callback(async ({ response }) => {
    return response.ok(
      LocaleService.getLangManifests() as unknown as {
        name: string
        alternative?: string[]
        icon: string
        displayName: string
      }[]
    )
  })

const getLocale = forge
  .query({
    description: 'Retrieve localization strings for namespace',
    noAuth: true,
    input: {
      query: z.object({
        lang: z.string(),
        namespace: z.enum(ALLOWED_NAMESPACE),
        subnamespace: z
          .string()
          .regex(/^$|^@[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$|^[a-zA-Z0-9_.-]+$/)
      })
    },
    output: {
      OK: z.record(z.string(), z.any()),
      NOT_FOUND: true
    }
  })
  .callback(async ({ query: { lang, namespace, subnamespace }, response }) => {
    const moduleApps = getModulesWithLocales()

    const finalLang = LocaleService.getAllowedLang().find(e =>
      e.includes(lang)
    )?.[0]

    if (!finalLang) {
      return response.notFound()
    }

    let data

    if (namespace === 'apps') {
      const target = moduleApps.find(modulePath => {
        try {
          const pkgPath = path.join(modulePath, 'package.json')

          if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

            return pkg.name === subnamespace
          }
        } catch {
          return false
        }
      })

      if (!target) {
        return response.ok({})
      }

      const localePath = path.join(target, 'locales', `${finalLang}.json`)

      if (!fs.existsSync(localePath)) {
        return response.ok({})
      }

      data = JSON.parse(fs.readFileSync(localePath, 'utf-8'))
    } else {
      const systemLocales = LocaleService.getSystemLocales()[finalLang]
      const directData = systemLocales?.[subnamespace]

      if (directData) {
        data = directData
      } else {
        const commonData = subnamespace
          ? systemLocales?.['common']?.[subnamespace]
          : systemLocales?.['common']

        if (commonData) {
          data = commonData
        } else {
          return response.ok({})
        }
      }
    }

    if (
      namespace === 'common' &&
      (!subnamespace || subnamespace === 'sidebar')
    ) {
      const targetToBeInjected = subnamespace ? data : data.sidebar

      targetToBeInjected.apps = {
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

              const pkgPath = path.join(modulePath, 'package.json')

              let moduleName = path.basename(modulePath)

              if (fs.existsSync(pkgPath)) {
                try {
                  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
                  moduleName = pkg.name
                } catch {
                  // Do nothing
                }
              }

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

    return response.ok(data)
  })

const listUnsupportedModules = forge
  .query({
    description:
      "List modules that do not support the user's currently selected language",
    output: {
      OK: z.array(z.string()),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, response }) => {
    const userLanguage = pb.instance.authStore.record?.language

    if (!userLanguage) {
      return response.notFound()
    }

    const finalLang = LocaleService.getAllowedLang().find(e =>
      e.includes(userLanguage)
    )?.[0]

    if (!finalLang) {
      return response.notFound()
    }

    const normalizedSelected = finalLang.toLowerCase()

    const unsupported = ModuleRegistry.entries
      .filter(
        m => !m.supportedLangs.some(l => l.toLowerCase() === normalizedSelected)
      )
      .map(m => m.name)

    return response.ok(unsupported)
  })

export default forgeRouter({
  listLanguages,
  getLocale,
  listUnsupportedModules
})
