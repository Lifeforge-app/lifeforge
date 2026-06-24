import { useEffect } from 'react'

import { getI18n } from '../getI18n'

export function useLanguageEffect(language: string) {
  useEffect(() => {
    const i18n = getI18n()

    if (!i18n?.changeLanguage) {
      return
    }

    if (i18n.language !== language) {
      i18n.changeLanguage(language).catch(() => {
        console.error('Failed to change language.')
      })
    }
  }, [language])
}
