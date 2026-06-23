import type { InitOptions, i18n } from 'i18next'

interface ClientI18nConfigOptions {
  i18n: i18n
  forgeAPI: {
    locales: {
      getLocale: {
        input: (data: {
          lang: string
          namespace: 'apps' | 'common'
          subnamespace: string
        }) => { endpoint: string }
      }
      notifyMissing: {
        mutate: (data: {
          namespace: string
          missingKey: string
        }) => Promise<unknown>
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
  i18n,
  forgeAPI,
  getAvailableLanguages
}: ClientI18nConfigOptions): InitOptions {
  i18n.on('loaded', () => {
    const loadedLangs = i18n.languages || ['en']

    for (const lang of loadedLangs) {
      const commonBundle = i18n.getResourceBundle(lang, 'common') as Record<string, unknown> | undefined

      if (commonBundle) {
        const subnamespaces = Object.keys(commonBundle)

        for (const sub of subnamespaces) {
          i18n.addResourceBundle(
            lang,
            `common.${sub}`,
            (commonBundle[sub] as Record<string, unknown>) || {},
            true,
            true
          )
        }
      }
    }
  })

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
    returnedObjectHandler(
      key: string,
      value: string,
      options: Record<string, unknown>
    ): string {
      return JSON.stringify({ key, value, options })
    },
    fallbackNS: false,
    defaultNS: 'common',
    ns: ['common'],
    saveMissing: true,
    missingKeyHandler: (
      _lngs: readonly string[],
      namespace: string,
      key: string
    ) => {
      if (
        !namespace ||
        !['apps', 'common'].includes(namespace.split('.')[0] ?? '')
      ) {
        return
      }

      forgeAPI.locales.notifyMissing
        .mutate({
          namespace,
          missingKey: key
        })
        .catch(() => {})
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

        console.log(namespace, subnamespace)

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
