import i18n from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

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
      useSuspense: false,
      bindI18n: 'languageChanged loaded'
    },
    cleanCode: true,
    debug: false,
    interpolation: {
      escapeValue: false
    },
    ns: ['common'],
    returnedObjectHandler: (key, value, options) => {
      return JSON.stringify({ key, value, options })
    },
    backend: {
      loadPath: (langs: string[], namespaces: string[]) => {
        const namespace = namespaces[0]?.split('.')[0]
        if (!namespace) return

        const lang = langs.find(l => l !== 'dev')
        if (!lang) return

        return `https://raw.githubusercontent.com/Lifeforge-app/lifeforge/main/locales/lang-${lang}/${namespace}.json`
      }
    }
  })
  .catch(err => {
    console.error('Failed to initialize i18n: ', err)
  })

export default i18n
