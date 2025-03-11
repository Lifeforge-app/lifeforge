import { cookieParse } from 'pocketbase'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

function LocalizationManager(): React.ReactElement {
  const { t } = useTranslation('modules.localizationManager')
  const navigate = useNavigate()

  useEffect(() => {
    const token = cookieParse(document.cookie).token

    if (!token) {
      window.location.href = '/'
    } else {
      const a = document.createElement('a')
      a.href = `${import.meta.env.VITE_LOCALIZATION_MANAGER_URL}?token=${token}`
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
