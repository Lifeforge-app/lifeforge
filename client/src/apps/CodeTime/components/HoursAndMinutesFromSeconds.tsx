import { useTranslation } from 'react-i18next'

export default function HoursAndMinutesFromSeconds({
  seconds
}: {
  seconds: number
}) {
  const { t } = useTranslation('apps.codeTime')

  return (
    <>
      {Math.floor(seconds / 60) > 0 ? (
        <>
          {Math.floor(seconds / 60)}
          <span className="text-bg-500 pl-1 text-3xl font-normal">
            {t('units.h')}
          </span>
        </>
      ) : (
        ''
      )}{' '}
      {Math.floor(seconds % 60) > 0 ? (
        <>
          {Math.floor(seconds % 60)}
          <span className="text-bg-500 pl-1 text-3xl font-normal">
            {t('units.m')}
          </span>
        </>
      ) : (
        ''
      )}{' '}
      {seconds === 0 ? 'no time' : ''}
    </>
  )
}
