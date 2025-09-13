import i18n from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import forgeAPI from './utils/forgeAPI'

i18n
  .use(I18NextHttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'en',
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
          !['en', 'zh-TW', 'zh-CN', 'ms'].includes(langs[0]) ||
          !namespaces.filter(e => e && e !== 'undefined').length
        ) {
          return
        }

        const [namespace, subnamespace] = namespaces[0].split('.')

        if (!['apps', 'common'].includes(namespace)) {
          return
        }

        return forgeAPI.locales.getLocale.input({
          lang: langs[0] as 'en' | 'zh' | 'zh-TW' | 'zh-CN' | 'ms',
          namespace: namespace as 'apps' | 'common',
          subnamespace: subnamespace
        }).endpoint
      },
      parse: (data: string) => {
        return JSON.parse(data).data
      }
    }
  })
  .catch(() => {
    console.error('Failed to initialize i18n')
  })

export default i18n
