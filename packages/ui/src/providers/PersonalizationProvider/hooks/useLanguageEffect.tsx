import i18n from 'i18next'
import { useEffect } from 'react'
import { toast } from '@/providers'

function useLanguageEffect(language: string) {
  useEffect(() => {
    if (!i18n || !i18n.changeLanguage) {
      console.error('i18n instance is not available')

      return
    }

    if (i18n.isInitialized && i18n.language !== language) {
      i18n.changeLanguage(language).catch(() => {
        toast.error('Failed to change language.')
      })
    }
  }, [language])
}

export default useLanguageEffect
