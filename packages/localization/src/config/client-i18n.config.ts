import type { InitOptions } from 'i18next'

interface ClientI18nConfigOptions {
  forgeAPI: {
    locales: {
      notifyMissing: {
        mutate: (data: { namespace: string; key: string }) => Promise<unknown>
      }
      getLocale: {
        input: (data: {
          lang: string
          namespace: 'apps' | 'common'
          subnamespace: string
        }) => { endpoint: string }
      }
    }
  }
  getAvailableLanguages: () => { name: string; alternative?: string[]; icon: string }[]
}

export function clientI18nConfig({
  forgeAPI,
  getAvailableLanguages
}: ClientI18nConfigOptions): InitOptions {
  return {
    lng: 'en',
    fallbackLng: 'en',
    cache: {
      enabled: true
    },
    initImmediate: true,
    maxRetries: 1,
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded'
    },
    cleanCode: true,
    debug: false,
    interpolation: {
      escapeValue: false
    },
    returnedObjectHandler(key: string, value: string, options: Record<string, unknown>): string {
      return JSON.stringify({ key, value, options })
    },
    fallbackNS: false,
    defaultNS: false,
    saveMissing: true,
    missingKeyHandler: async (_, namespace, key) => {
      if (!namespace || !['apps', 'common'].includes(namespace.split('.')[0] ?? '')) {
        return
      }

      await forgeAPI.locales.notifyMissing.mutate({
        namespace,
        key
      })
    },
    backend: {
      loadPath: (langs: string[], namespaces: string[]) => {
        if (
          !getAvailableLanguages()
            .map(e => e.name)
            .flat()
            .includes(langs[0] ?? '') ||
          !namespaces.filter(e => e && e !== 'undefined').length
        ) {
          return
        }

        const [namespace, subnamespace] = namespaces[0]!.split('.')

        if (!['apps', 'common'].includes(namespace ?? '')) {
          return
        }

        return forgeAPI.locales.getLocale.input({
          lang: langs[0] ?? '',
          namespace: namespace as 'apps' | 'common',
          subnamespace: subnamespace ?? ''
        }).endpoint
      },
      parse: (data: string) => {
        return JSON.parse(data).data
      }
    }
  }
}
