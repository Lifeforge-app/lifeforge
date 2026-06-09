import i18n from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import forgeAPI from './forgeAPI'

export let AVAILABLE_LANG: {
  name: string
  alternative?: string[]
  icon: string
}[] = [{ name: 'en', icon: 'circle-flags:gb' }]

i18n.use(I18NextHttpBackend).use(initReactI18next)

export async function initI18n() {
  if (i18n.isInitialized) {
    return i18n
  }

  try {
    const langRes = await fetch(
      `${import.meta.env.VITE_API_HOST}/locales/listLanguages`
    )

    if (langRes.ok) {
      const data = await langRes.json()

      if (data?.data) {
        AVAILABLE_LANG = data.data
      }
    }
  } catch (err) {
    console.warn(
      'Failed to fetch available languages, falling back to default:',
      err
    )
  }

  await i18n.init({
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
    returnedObjectHandler: (key, value, options) => {
      return JSON.stringify({ key, value, options })
    },
    fallbackNS: false,
    defaultNS: false,
    saveMissing: true,
    missingKeyHandler: async (_, namespace, key) => {
      if (!['apps', 'common'].includes(namespace?.split('.')[0])) {
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
          !AVAILABLE_LANG.map(e => e.name)
            .flat()
            .includes(langs[0]) ||
          !namespaces.filter(e => e && e !== 'undefined').length
        ) {
          return
        }

        const [namespace, subnamespace] = namespaces[0].split('.')

        if (!['apps', 'common'].includes(namespace)) {
          return
        }

        return forgeAPI.locales.getLocale.input({
          lang: langs[0],
          namespace: namespace as 'apps' | 'common',
          subnamespace: subnamespace
        }).endpoint
      },
      parse: (data: string) => {
        return JSON.parse(data).data
      }
    }
  })

  return i18n
}
