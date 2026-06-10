import i18n from 'i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import { clientI18nConfig } from '@lifeforge/localization'

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

  await i18n.init(
    clientI18nConfig({
      forgeAPI,
      getAvailableLanguages: () => AVAILABLE_LANG
    })
  )

  return i18n
}
