import { parse as parseCookie } from 'cookie'
import { ModuleWrapper } from 'lifeforge-ui'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

function LocalizationManager() {
  const { t } = useTranslation('apps.localizationManager')
  const navigate = useNavigate()

  useEffect(() => {
    const session = parseCookie(document.cookie).session

    if (!session) {
      window.location.href = '/'
    } else {
      const a = document.createElement('a')
      a.href = `${import.meta.env.VITE_LOCALIZATION_MANAGER_URL}?token=${session}`
      a.target = '_blank'
      a.click()

      navigate(-1)
      toast.success(t('fetch.redirected'))
    }
  }, [])

  return (
    <ModuleWrapper>
      <div className="flex size-full items-center justify-center">
        <p className="text-bg-500 text-2xl font-medium">
          {t('fetch.redirecting')}
        </p>
      </div>
    </ModuleWrapper>
  )
}

export default LocalizationManager
