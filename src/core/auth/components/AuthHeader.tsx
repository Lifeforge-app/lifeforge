import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

function AuthHeader(): React.ReactElement {
  const { t } = useTranslation('common.auth')

  return (
    <>
      <h1 className="mb-8 flex items-center gap-2 whitespace-nowrap text-3xl font-semibold">
        <Icon className="text-custom-500 text-5xl" icon="tabler:hammer" />
        <div>
          LifeForge<span className="text-custom-500 text-4xl">.</span>
        </div>
      </h1>
      <h2 className="text-center text-4xl font-semibold tracking-wide sm:text-5xl">
        {t('header')}
      </h2>
      <p className="text-bg-500 mt-2 text-center text-base sm:mt-4 sm:text-xl">
        {t('desc')}
      </p>
    </>
  )
}

export default AuthHeader
