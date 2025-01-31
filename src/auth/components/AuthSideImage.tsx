import React from 'react'
import { useTranslation } from 'react-i18next'

function AuthSideImage(): React.ReactElement {
  const { t } = useTranslation('common.auth')

  return (
    <section className="relative hidden h-full w-1/2 lg:flex">
      <img
        src="/assets/login.jpg"
        alt="Login"
        className="h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-br from-custom-500 to-custom-600 opacity-30" />
      <div className="absolute inset-0 bg-bg-900/50" />
      <p className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col text-center text-5xl font-semibold tracking-wide text-bg-50">
        <span className="mb-4 text-2xl text-custom-400">
          {t('sideImageDesc.part1')}
        </span>
        {t('sideImageDesc.part2')}
      </p>
    </section>
  )
}

export default AuthSideImage
