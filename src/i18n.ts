/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: navigator.language ?? 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })
  .catch(() => {
    console.error('Failed to initialize i18n')
  })

export default i18n
