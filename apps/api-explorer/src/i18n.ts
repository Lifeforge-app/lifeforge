import i18n from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(I18NextHttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'zh-CN',
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
    backend: {
      loadPath: (langs: string[], namespaces: string[]) => {
        if (
          !['en', 'zh', 'zh-TW', 'zh-CN', 'ms'].includes(langs[0]) ||
          !namespaces.filter(e => e && e !== 'undefined').length
        ) {
          return
        }

        return `${import.meta.env.VITE_API_HOST}/locales/${
          langs[0]
        }/${namespaces[0].split('.').join('/')}`
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
