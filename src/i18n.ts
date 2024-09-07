/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

function initLocale(): void {
  i18n
    .use(I18NextHttpBackend)
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      },
      backend: {
        loadPath: `${import.meta.env.VITE_API_HOST}/locales/{{lng}}`
      }
    })
    .catch(() => {
      console.error('Failed to initialize i18n')
    })
}

export default i18n
export { initLocale }
