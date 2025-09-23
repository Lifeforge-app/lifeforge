import { useTranslation } from 'react-i18next'

export default function HoursAndMinutesFromSeconds({
  seconds
}: {
  seconds: number
}) {
  const { t } = useTranslation('apps.codeTime')

  return (
    <>
      {seconds === 0 ? (
        <span className="text-bg-500 mr-4 block text-xl">
          {t('units.noTime')}
        </span>
      ) : (
        <>
          {Math.floor(seconds / 60) > 0 ? (
            <>
              {Math.floor(seconds / 60).toLocaleString()}
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
          )}
        </>
      )}
    </>
  )
}
