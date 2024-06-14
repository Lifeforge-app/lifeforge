/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(I18NextHttpBackend)
  .use(initReactI18next)
  .init({
    lng: navigator.language ?? 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: process.env.NODE_ENV === 'development',
    backend: {
      loadPath: `${import.meta.env.VITE_API_HOST}/locales/{{lng}}`
    }
  })
  .catch(() => {
    console.error('Failed to initialize i18n')
  })

export default i18n
