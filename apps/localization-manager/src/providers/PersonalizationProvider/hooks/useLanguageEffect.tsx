import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

function useLanguageEffect(
  isAuthed: boolean,
  language: string,
  setLanguageLoaded: (loaded: boolean) => void
) {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (!isAuthed) {
      setLanguageLoaded(true)
    }
  }, [isAuthed])

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
