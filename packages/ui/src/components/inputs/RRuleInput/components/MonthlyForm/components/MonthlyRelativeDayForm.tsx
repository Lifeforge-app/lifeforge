import { useTranslation } from 'react-i18next'

import { ListboxInput, ListboxOption } from '@/components/inputs'
import type { FreqSpecificParams } from '@/components/inputs/RRuleInput'
import { Box } from '@/components/primitives'

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export function MonthlyRelativeDayForm({
  data,
  setData
}: {
  data: FreqSpecificParams['monthly']
  setData: (data: FreqSpecificParams['monthly']) => void
}) {
  const { t } = useTranslation(['apps.calendar', 'common.misc'])

  return (
    <>
      <Box flex="1">
        <ListboxInput
          required
          icon="tabler:calendar"
          label={t('inputs.monthly.relativeDay.inputs.onThe')}
          renderContent={() => <>{t(`recurring.onThe.${data.onThe}`)}</>}
          value={data.onThe}
          onChange={onThe => setData({ ...data, onThe })}
        >
          {['first', 'second', 'third', 'fourth', 'last'].map(day => (
            <ListboxOption
              key={day}
              label={t(`recurring.onThe.${day}`)}
              value={day}
            />
          ))}
        </ListboxInput>
      </Box>
      <Box flex="1">
        <ListboxInput
          required
          icon="tabler:calendar"
          label={t('inputs.monthly.relativeDay.inputs.onTheDay')}
          renderContent={() => (
            <>
              {t(
                data.onTheDay.length === 3 && data.onTheDay !== 'day'
                  ? `common.misc:dates.days.${DAYS.indexOf(data.onTheDay as (typeof DAYS)[number])}`
                  : `recurring.onTheDay.${data.onTheDay}`
              )}
            </>
          )}
          value={data.onTheDay}
          onChange={onTheDay => setData({ ...data, onTheDay })}
        >
          {[...DAYS, 'day', 'weekday', 'weekendDay'].map((day, idx) => (
            <ListboxOption
              key={day}
              label={t(
                idx < 7
                  ? `common.misc:dates.days.${DAYS.indexOf(day as (typeof DAYS)[number])}`
                  : `recurring.onTheDay.${day}`
              )}
              value={day}
            />
          ))}
        </ListboxInput>
      </Box>
    </>
  )
}
