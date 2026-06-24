import type { InitOptions, i18n } from 'i18next'

interface ClientI18nConfigOptions {
  forgeAPI: {
    locales: {
      getLocale: {
        input: (data: {
          lang: string
          namespace: 'apps' | 'common'
          subnamespace: string
        }) => { endpoint: string }
      }
    }
  }
  getAvailableLanguages: () => {
    name: string
    alternative?: string[]
    icon: string
  }[]
}

export function clientI18nConfig({
  forgeAPI,
  getAvailableLanguages
}: ClientI18nConfigOptions): InitOptions {
  return {
    lng: 'en',
    fallbackLng: 'en',
    cache: { enabled: true },
    initImmediate: true,
    maxRetries: 1,
    cleanCode: true,
    debug: false,
    interpolation: { escapeValue: false },
    returnedObjectHandler(
      key: string,
      value: string,
      options: Record<string, unknown>
    ): string {
      return JSON.stringify({ key, value, options })
    },
    ns: ['common'],
    fallbackNS: false,
    saveMissing: false,
    parseMissingKeyHandler: (key: string) => `[MISSING LOCALE] ${key}`,
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
