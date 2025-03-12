import { useTranslation } from 'react-i18next'

function AuthSideImage() {
  const { t } = useTranslation('common.auth')

  return (
    <section className="relative hidden h-full w-1/2 lg:flex">
      <img
        alt="Login"
        className="h-full object-cover"
        src="/assets/login.jpg"
      />
      <div className="from-custom-500 to-custom-600 bg-linear-to-br absolute inset-0 opacity-30" />
      <div className="bg-bg-900/50 absolute inset-0" />
      <p className="text-bg-50 absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col text-center text-5xl font-semibold tracking-wide">
        <span className="text-custom-400 mb-4 text-2xl">
          {t('sideImageDesc.part1')}
        </span>
        {t('sideImageDesc.part2')}
      </p>
    </section>
  )
}

export default AuthSideImage
