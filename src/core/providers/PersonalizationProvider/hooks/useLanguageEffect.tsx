import { useAuth } from '@providers/AuthProvider'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

function useLanguageEffect(
  language: string,
  setLanguageLoaded: (loaded: boolean) => void
) {
  const { auth } = useAuth()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (!auth) {
      setLanguageLoaded(true)
    }
  }, [auth])

  useEffect(() => {
    i18n.on('loaded', () => {
      setLanguageLoaded(true)
    })

    i18n.changeLanguage(language).catch(() => {
      toast.error('Failed to change language.')
    })
  }, [language])
}

export default useLanguageEffect
