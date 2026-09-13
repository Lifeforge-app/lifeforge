import { useModuleTranslation } from '@lifeforge/localization'
import { Text } from '@lifeforge/ui'

export default function HoursAndMinutesFromSeconds({
  seconds
}: {
  seconds: number
}) {
  const { t } = useModuleTranslation()

  return (
    <>
      {seconds === 0 ? (
        <Text color="muted" mr="md" size="xl">
          {t('units.noTime')}
        </Text>
      ) : (
        <>
          {Math.floor(seconds / 60) > 0 ? (
            <>
              {Math.floor(seconds / 60).toLocaleString()}
              <Text as="span" color="muted" pl="xs" size="3xl">
                {t('units.h')}
              </Text>
            </>
          ) : (
            ''
          )}{' '}
          {Math.floor(seconds % 60) > 0 ? (
            <>
              {Math.floor(seconds % 60)}
              <Text as="span" color="muted" pl="xs" size="3xl">
                {t('units.m')}
              </Text>
            </>
          ) : (
            ''
          )}
        </>
      )}
    </>
  )
}
